import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';

export class UserLoginDto {
  @ApiProperty({ minLength: 4, maxLength: 49 })
  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @SanitizeHTML()
  @IsString()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Trim()
  @SanitizeHTML()
  @IsString()
  password: string;
}
