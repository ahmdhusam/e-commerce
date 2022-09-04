import { Transform } from 'class-transformer';
import { IsInt, IsNumber, isNumberString, IsOptional, IsPositive } from 'class-validator';

export class CartOptionsDto {
  @IsPositive()
  @IsInt()
  @IsNumber()
  @Transform(({ value }) => (isNumberString(value) ? +value : value))
  @IsOptional()
  limit: number;

  @IsPositive()
  @IsInt()
  @IsNumber()
  @Transform(({ value }) => (isNumberString(value) ? +value : value))
  @IsOptional()
  skip: number;
}
