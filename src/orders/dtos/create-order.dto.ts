import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';
import { CreditCardDto } from './credit-card.dto';

export class CreateOrderDto {
  @ApiProperty()
  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  country: string;

  @ApiProperty()
  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  city: string;

  @ApiProperty()
  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  address: string;

  @ApiProperty()
  @Type(() => CreditCardDto)
  @ValidateNested()
  @IsObject()
  creditCard: CreditCardDto;
}
