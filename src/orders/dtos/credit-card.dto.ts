import { ApiProperty } from '@nestjs/swagger';
import { IsCreditCard, IsNumberString, Min, IsInt, IsPositive, IsNumber, Max } from 'class-validator';

export class CreditCardDto {
  @ApiProperty()
  @IsCreditCard()
  number: string;

  @ApiProperty()
  @IsNumberString()
  cvc: string;

  @ApiProperty()
  @Min(2022)
  @IsInt()
  @IsPositive()
  @IsNumber()
  expYear: number;

  @ApiProperty()
  @Max(12)
  @IsInt()
  @IsPositive()
  @IsNumber()
  expMonth: number;
}
