import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ProductData } from './dtos';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productsRepo: Repository<Product>) {}

  create(author: User, productData: ProductData): Promise<Product> {
    return this.productsRepo.create({ ...productData, author }).save();
  }
}
