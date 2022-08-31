import {
  Length,
  IsString,
  IsEmail,
  IsDateString,
  IsLatitude,
  IsNumber,
  IsOptional,
  IsLongitude,
} from 'class-validator';
import { Trim, ToLowerCase } from 'src/libs';

export class UpdateUser {
  @Length(4, 49)
  @Trim()
  @IsString()
  @IsOptional()
  name?: string;

  @ToLowerCase()
  @Length(4, 49)
  @Trim()
  @IsString()
  @IsOptional()
  username?: string;

  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsLatitude({ message: 'lat must be a latitude' })
  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsLongitude({ message: 'lng must be a longitude' })
  @IsNumber()
  @IsOptional()
  lng?: number;
}
