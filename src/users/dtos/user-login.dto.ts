import { IsEmail, IsString, Length } from 'class-validator';
import { SanitizeHTML, ToLowerCase, Trim } from 'src/libs';

export class UserLoginDto {
  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @SanitizeHTML()
  @IsString()
  email: string;

  @Length(8, 60)
  @Trim()
  @SanitizeHTML()
  @IsString()
  password: string;
}
