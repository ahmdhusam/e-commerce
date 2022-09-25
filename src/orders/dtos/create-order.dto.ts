import { IsString } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';

export class CreateOrderDto {
  @ToLowerCase()
  @Trim()
  @SanitizeHTML()
  @IsString()
  payment: string;

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
}
