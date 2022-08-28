import { IsEnum, IsNumber, IsPositive, IsString, Length, Max } from 'class-validator';
import { Trim } from 'src/libs';
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

  @Max(999999)
  @IsPositive()
  @IsNumber()
  price: number;

  @IsPositive()
  @IsNumber()
  quantity: number;

  @IsEnum(Category)
  category: Category;
}
