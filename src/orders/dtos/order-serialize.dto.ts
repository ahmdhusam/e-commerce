import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductSerializeDto } from 'src/products/dtos';

export class OrderSerializeDto {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty()
  @Expose()
  total: number;

  @ApiResponseProperty()
  @Expose()
  country: string;

  @ApiResponseProperty()
  @Expose()
  city: string;

  @ApiResponseProperty()
  @Expose()
  address: string;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Type(() => ProductSerializeDto)
  @Expose()
  products: ProductSerializeDto;
}
