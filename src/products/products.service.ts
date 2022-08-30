import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ProductData } from './dtos';
import { UpdateProduct } from './dtos/update-product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productsRepo: Repository<Product>) {}

  create(author: User, productData: ProductData): Promise<Product> {
    return this.productsRepo.create({ ...productData, author }).save();
  }

  async update(productId: string, productData: Omit<UpdateProduct, 'id'>, currentUser: User): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(currentUser, product);

    Object.assign(product, productData);
    return product.save();
  }

  async delete(productId: string, user: User): Promise<Product> {
    const product = await this.getOneById(productId);
    this.isAuthorized(user, product);

    await product.remove();

    return product;
  }

  isAuthorized(user: User, product: Product): void {
    if (product.author.id !== user.id) throw new ForbiddenException('unauthorized');
  }

  getOneById(productId: string): Promise<Product> {
    return this.productsRepo.findOneOrFail({ where: { id: productId }, relations: ['author'] }).catch(() => {
      throw new NotFoundException('product Not Found');
    });
  }
}
