import { ApiProperty } from '@nestjs/swagger';
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
import { Trim, ToLowerCase, SanitizeHTML, ParseNumber } from 'src/shared/libs';

export class UpdateUserDto {
  @ApiProperty({ minLength: 4, maxLength: 49, required: false })
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ minLength: 4, maxLength: 49, required: false, uniqueItems: true })
  @ToLowerCase()
  @Length(4, 49)
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ minLength: 4, maxLength: 49, required: false, uniqueItems: true })
  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @SanitizeHTML()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({ title: 'Latitude', required: false })
  @IsLatitude({ message: 'lat must be a latitude' })
  @IsNumber()
  @ParseNumber()
  @IsOptional()
  lat?: number;

  @ApiProperty({ title: 'Longitude', required: false })
  @IsLongitude({ message: 'lng must be a longitude' })
  @IsNumber()
  @ParseNumber()
  @IsOptional()
  lng?: number;

  avatar?: string;

  header?: string;
}
