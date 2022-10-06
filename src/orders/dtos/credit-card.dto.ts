import { IsCreditCard, IsNumberString, Min, IsInt, IsPositive, IsNumber, Max } from 'class-validator';

export class CreditCardDto {
  @IsCreditCard()
  number: string;

  @IsNumberString()
  cvc: string;

  @Min(2022)
  @IsInt()
  @IsPositive()
  @IsNumber()
  expYear: number;

  @Max(12)
  @IsInt()
  @IsPositive()
  @IsNumber()
  expMonth: number;
}
