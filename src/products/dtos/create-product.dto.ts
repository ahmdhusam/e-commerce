import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsPositive, IsString, Length, Max } from 'class-validator';
import { ParseNumber, ParsePrice, SanitizeHTML, Trim } from 'src/shared/libs';
import { Category } from '../products.entity';

export class ProductDataDto {
  @ApiProperty({ minLength: 3, maxLength: 100 })
  @Length(3, 100)
  @Trim()
  @SanitizeHTML()
  @IsString()
  title: string;

  @ApiProperty({ maxLength: 400 })
  @Length(0, 400)
  @Trim()
  @SanitizeHTML()
  @IsString()
  description: string;

  @ApiProperty()
  @ParsePrice()
  @Max(999999)
  @IsPositive()
  @IsNumber()
  @ParseNumber()
  price: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNumber()
  @ParseNumber()
  quantity: number;

  images: string[];

  @ApiProperty({ enum: Category, enumName: 'Category' })
  @IsEnum(Category)
  category: Category;
}
