import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ minLength: 4, maxLength: 49 })
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  name: string;

  @ApiProperty({ minLength: 4, maxLength: 49, uniqueItems: true })
  @ToLowerCase()
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  username: string;

  @ApiProperty({ minLength: 4, maxLength: 49, uniqueItems: true })
  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @SanitizeHTML()
  @IsString()
  email: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ title: 'Latitude', required: false })
  @IsLatitude({ message: 'lat must be a latitude' })
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiProperty({ title: 'Longitude', required: false })
  @IsLongitude({ message: 'lng must be a longitude' })
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Trim()
  @IsString()
  password: string;
}
