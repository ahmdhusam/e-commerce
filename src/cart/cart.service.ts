import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    private readonly productService: ProductsService,
  ) {}

  getOne(ownerId: string, productId: string, relations: ('owner' | 'product' | 'order')[] = []): Promise<Cart | null> {
    return this.cartRepo.findOneOrFail({ where: { ownerId, productId }, relations }).catch(() => {
      throw new NotFoundException('product not found in cart');
    });
  }

  async add(to: User, productId: string, quantity: number): Promise<void> {
    try {
      await this.update(to.id, productId, quantity);
    } catch (e) {
      // Create a new one if it doesn't exist
      if (e instanceof Error && !e.message.includes('product not found in cart')) throw e;
      await this.create({ ownerId: to.id, productId, quantity });
    }
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
}
