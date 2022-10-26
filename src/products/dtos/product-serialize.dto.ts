import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserSerializeDto } from 'src/users/dtos';
import { Category } from '../products.entity';

export class ProductSerializeDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  description: string;

  @ApiResponseProperty()
  @Expose()
  price: number;

  @ApiResponseProperty()
  @Expose()
  quantity: number;

  @ApiResponseProperty()
  @Expose()
  images: string[];

  @ApiResponseProperty()
  @Expose()
  category: Category;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Type(() => UserSerializeDto)
  @Expose()
  author: UserSerializeDto;
}
