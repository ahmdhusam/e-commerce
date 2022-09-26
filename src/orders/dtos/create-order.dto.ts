import { IsCreditCard, IsInt, IsNumber, IsNumberString, IsPositive, IsString, Max, Min } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';

export class CreateOrderDto {
  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  country: string;

  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  city: string;

  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  address: string;

  @IsCreditCard()
  cardNumber: string;

  @IsNumberString()
  cardCvc: string;

  @Min(2022)
  @IsInt()
  @IsPositive()
  @IsNumber()
  cardExpYear: number;

  @Max(12)
  @IsInt()
  @IsPositive()
  @IsNumber()
  cardExpMonth: number;
}
