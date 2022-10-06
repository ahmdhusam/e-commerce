import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';
import { CreditCardDto } from './credit-card.dto';

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

  @Type(() => CreditCardDto)
  @ValidateNested()
  @IsObject()
  creditCard: CreditCardDto;
}
