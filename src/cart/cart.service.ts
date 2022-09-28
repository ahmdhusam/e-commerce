import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/products.entity';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    private readonly productService: ProductsService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async cart(user: User, limit: number, skip: number): Promise<Product[]> {
    return this.cartRepo
      .createQueryBuilder('cart')
      .select('id, title, description, price, category, cart.quantity as quantity')
      .innerJoin(Product, 'product', 'cart.product_id = product.id')
      .where('cart.owner_id = :ownerId', { ownerId: user.id })
      .andWhere('cart.in_order = false')
      .orderBy('cart.created_at', 'ASC')
      .limit(limit)
      .offset(skip)
      .getRawMany();
  }

  getOne(ownerId: string, productId: string, relations: ('owner' | 'product' | 'order')[] = []): Promise<Cart | null> {
    return this.cartRepo.findOneOrFail({ where: { ownerId, productId, inOrder: false }, relations }).catch(() => {
      throw new NotFoundException('product not found in cart');
    });
  }

  async add(to: User, productId: string, quantity: number): Promise<void> {
    const product = await this.productService.productToCart(productId, quantity);

    let cartItem = await this.cartRepo.findOneBy({ ownerId: to.id, productId });

    if (!cartItem) cartItem = this.cartRepo.create({ ownerId: to.id, productId, quantity });
    else if (cartItem.inOrder) throw new BadRequestException('product in order');
    else cartItem.quantity += quantity;

    // By transaction
    await this.entityManager.save([product, cartItem]);
  }

  async reverse(ownerId: string, productId: string, quantity: number): Promise<Cart | void> {
    const cartItem = await this.getOne(ownerId, productId);

    if (quantity > cartItem.quantity) throw new BadRequestException();

    if (cartItem.quantity === quantity) {
      return this.delete(ownerId, productId);
    }
    await this.productService.reverseFromCart(productId, quantity);

    cartItem.quantity -= quantity;

    return cartItem.save().catch(async () => {
      await this.productService.productToCart(productId, quantity);
      throw new BadGatewayException();
    });
  }

  async create(cartData: Pick<Cart, 'ownerId' | 'productId' | 'quantity'>): Promise<Cart> {
    await this.productService.productToCart(cartData.productId, cartData.quantity);
    return this.cartRepo
      .create(cartData)
      .save()
      .catch(async () => {
        await this.productService.reverseFromCart(cartData.productId, cartData.quantity);
        throw new BadRequestException("can't add to cart");
      });
  }

  async update(ownerId: string, productId: string, quantity: number): Promise<Cart> {
    const cartItem = await this.getOne(ownerId, productId);

    await this.productService.productToCart(productId, quantity);
    cartItem.quantity += quantity;

    return cartItem.save().catch(async () => {
      await this.productService.reverseFromCart(productId, quantity);
      throw new BadRequestException("can't update cart");
    });
  }

  async delete(ownerId: string, productId: string): Promise<void> {
    const cartItem = await this.getOne(ownerId, productId);
    const product = await this.productService.reverseFromCart(productId, cartItem.quantity);

    await this.entityManager.transaction(async transactionManager => {
      await Promise.all([
        transactionManager.delete(Cart, { ownerId: cartItem.ownerId, productId: cartItem.productId }),
        transactionManager.save(product),
      ]);
    });
  }
}
