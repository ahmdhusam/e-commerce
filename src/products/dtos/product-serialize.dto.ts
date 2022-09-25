import { Expose, Type } from 'class-transformer';
import { UserSerializeDto } from 'src/users/dtos';
import { Category } from '../products.entity';

export class ProductSerializeDto {
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

  @Type(() => UserSerializeDto)
  @Expose()
  author: UserSerializeDto;
}
