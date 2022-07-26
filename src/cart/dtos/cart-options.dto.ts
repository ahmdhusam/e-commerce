import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, isNumberString, IsOptional, IsPositive } from 'class-validator';

export class CartOptionsDto {
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
