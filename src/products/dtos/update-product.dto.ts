import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, Max } from 'class-validator';
import { Trim } from 'src/libs';
import { Category } from '../products.entity';

export class UpdateProduct {
  @IsUUID('4')
  @IsString()
  id: string;

  @Length(3, 100)
  @Trim()
  @IsString()
  @IsOptional()
  title?: string;

  @Length(0, 400)
  @Trim()
  @IsString()
  @IsOptional()
  description?: string;

  @Max(999999)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;
}
