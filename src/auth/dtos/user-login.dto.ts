import { IsEmail, IsString, Length } from 'class-validator';
import { ToLowerCase, Trim } from 'src/libs';

export class UserLoginDto {
  @ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Trim()
  @IsString()
  email: string;

  @Length(8, 60)
  @Trim()
  @IsString()
  password: string;
}
