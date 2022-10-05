import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ProductDataDto } from './dtos';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productsRepo: Repository<Product>) {}

  create(author: User, productData: ProductDataDto): Promise<Product> {
    return this.productsRepo.create({ ...productData, author }).save();
  }

  async update(user: User, productId: string, productData: Omit<UpdateProductDto, 'id'>): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(user, product);

    Object.assign(product, productData);
    return product.save();
  }

  async productToCart(productId: string, quantity: number): Promise<Product> {
    const product = await this.getOneById(productId);
    if (quantity > product.quantity)
      throw new BadRequestException('the quantity should be smaller than the quantity of the product');

    product.quantity -= quantity;
    product.inOrder += quantity;

    return product;
  }

  async reverseFromCart(productId: string, quantity: number): Promise<Product> {
    const product = await this.getOneById(productId);
    if (quantity > product.inOrder) throw new BadRequestException();

    product.quantity += quantity;
    product.inOrder -= quantity;

    return product;
  }

  async delete(user: User, productId: string): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(user, product);

    await product.remove();

    return product;
  }

  isAuthorized(user: User, product: Product): void {
    if (product.author.id !== user.id) throw new UnauthorizedException();
  }

  getOneById(productId: string): Promise<Product> {
    if (!isUUID(productId, '4')) throw new BadRequestException('product id must be a UUID v4');

    return this.productsRepo.findOneOrFail({ where: { id: productId }, relations: ['author'] }).catch(() => {
      throw new NotFoundException('product Not Found');
    });
  }
}
