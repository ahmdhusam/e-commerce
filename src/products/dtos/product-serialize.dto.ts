import { Expose, Type } from 'class-transformer';
import { UserSerialize } from 'src/users/dtos';
import { Category } from '../products.entity';

export class ProductSerialize {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  category: Category;

  @Expose()
  createdAt: Date;

  @Type(() => UserSerialize)
  @Expose()
  author: UserSerialize;
}
