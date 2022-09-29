import { Expose, Type } from 'class-transformer';
import { ProductSerializeDto } from 'src/products/dtos';

export class OrderSerializeDto {
  @Expose()
  id: number;

  @Expose()
  total: number;

  @Expose()
  country: string;

  @Expose()
  city: string;

  @Expose()
  address: string;

  @Expose()
  createdAt: Date;

  @Type(() => ProductSerializeDto)
  @Expose()
  products: ProductSerializeDto;
}
