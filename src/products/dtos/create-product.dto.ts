import { IsEnum, IsInt, IsNumber, IsPositive, IsString, Length, Max } from 'class-validator';
import { ParsePrice, SanitizeHTML, Trim } from 'src/libs';
import { Category } from '../products.entity';

export class ProductDataDto {
  @Length(3, 100)
  @Trim()
  @SanitizeHTML()
  @IsString()
  title: string;

  @Length(0, 400)
  @Trim()
  @SanitizeHTML()
  @IsString()
  description: string;

  @ParsePrice()
  @Max(999999)
  @IsPositive()
  @IsNumber()
  price: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  quantity: number;

  @IsEnum(Category)
  category: Category;
}
