import { IsString, IsNumber, Min, Max, Length, IsEmail, IsDateString, IsOptional } from 'class-validator';
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

  @Max(90)
  @Min(-90)
  @IsNumber()
  @IsOptional()
  lat: number;

  @Max(180)
  @Min(-180)
  @IsNumber()
  @IsOptional()
  lng: number;

  @Length(8, 60)
  @Trim()
  @IsString()
  password: string;
}
