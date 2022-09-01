import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isPositive, isUUID } from 'class-validator';
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

  getOne(ownerId: string, productId: string): Promise<Cart | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.cartRepo.findOneBy({ owner: ownerId, product: productId });
  }

  async add(to: User, productId: string, quantity: number): Promise<void> {
    if (!isUUID(productId, '4')) throw new BadRequestException('product-id must be a UUID v4');
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    const [product, cartItem] = await Promise.all([
      this.productService.getOneById(productId),
      this.getOne(to.id, productId),
    ]);

    if (product.quantity < quantity)
      throw new BadRequestException('the quantity should be smaller than the quantity of the product');

    // Create a new one if it doesn't exist
    if (!cartItem) {
      const newCart = this.cartRepo.create();
      Object.assign(newCart, { owner: to.id, product: productId, quantity });

      product.quantity -= quantity;

      await Promise.all([newCart.save(), product.save()]);
      return;
    }

    product.quantity -= quantity;
    cartItem.quantity += quantity;

    await Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.cartRepo.update({ owner: cartItem.owner, product: cartItem.product }, { quantity: cartItem.quantity }),
      product.save(),
    ]);
  }
}
