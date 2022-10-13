import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, IsInt, IsNumber, isNumberString, IsOptional } from 'class-validator';

export class ProductsOptionsDto {
  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  @IsNumber()
  @Transform(({ value }) => (isNumberString(value) ? +value : value))
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  @IsNumber()
  @Transform(({ value }) => (isNumberString(value) ? +value : value))
  @IsOptional()
  skip?: number;
}
