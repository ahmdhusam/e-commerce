import { IsEnum, IsInt, IsNumber, IsPositive, IsString, Length, Max } from 'class-validator';
import { ParsePrice, Trim } from 'src/libs';
import { Category } from '../products.entity';

export class ProductData {
  @Length(3, 100)
  @Trim()
  @IsString()
  title: string;

  @Length(0, 400)
  @Trim()
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
