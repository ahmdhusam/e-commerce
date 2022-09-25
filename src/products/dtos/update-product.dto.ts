import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, Max } from 'class-validator';
import { ParsePrice, SanitizeHTML, Trim } from 'src/libs';
import { Category } from '../products.entity';

export class UpdateProductDto {
  @IsUUID('4')
  @IsString()
  id: string;

  @Length(3, 100)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  title?: string;

  @Length(0, 400)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  description?: string;

  @ParsePrice()
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
