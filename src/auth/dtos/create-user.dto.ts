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
import { Trim, ToLowerCase } from 'src/libs';

export class CreateUser {
  @Length(4, 49)
  @Trim()
  @IsString()
  name: string;

  @ToLowerCase()
  @Length(4, 49)
  @Trim()
  @IsString()
  username: string;

  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
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
