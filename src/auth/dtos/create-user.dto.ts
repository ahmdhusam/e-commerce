import {
  IsString,
  IsNumber,
  Length,
  IsEmail,
  IsDateString,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Trim, ToLowerCase, SanitizeHTML } from 'src/libs';

export class CreateUserDto {
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  name: string;

  @ToLowerCase()
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  username: string;

  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @SanitizeHTML()
  @IsString()
  email: string;

  @IsDateString()
  birthDate: Date;

  @IsLatitude({ message: 'lat must be a latitude' })
  @IsNumber()
  @IsOptional()
  lat: number;

  @IsLongitude({ message: 'lng must be a longitude' })
  @IsNumber()
  @IsOptional()
  lng: number;

  @Length(8, 60)
  @Trim()
  @IsString()
  password: string;
}
