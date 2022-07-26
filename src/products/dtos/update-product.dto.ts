import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, Max } from 'class-validator';
import { ParseNumber, ParsePrice, SanitizeHTML, Trim } from 'src/shared/libs';
import { Category } from '../products.entity';

export class UpdateProductDto {
  @ApiProperty({ type: 'UUIDv4' })
  @IsUUID('4')
  @IsString()
  id: string;

  @ApiProperty({ required: false, minLength: 3, maxLength: 100 })
  @Length(3, 100)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, maxLength: 400 })
  @Length(0, 400)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @ParsePrice()
  @Max(999999)
  @IsPositive()
  @IsNumber()
  @ParseNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  @IsNumber()
  @ParseNumber()
  @IsOptional()
  quantity?: number;

  images: string[];

  @ApiProperty({ required: false, enum: Category, enumName: 'Category' })
  @IsEnum(Category)
  @IsOptional()
  category?: Category;
}
