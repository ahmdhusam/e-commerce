import { IsString } from 'class-validator';
import { ToLowerCase, Trim } from 'src/libs';

export class CreateOrderDto {
  @ToLowerCase()
  @Trim()
  @IsString()
  payment: string;

  @ToLowerCase()
  @Trim()
  @IsString()
  country: string;

  @ToLowerCase()
  @Trim()
  @IsString()
  city: string;

  @ToLowerCase()
  @Trim()
  @IsString()
  address: string;
}
