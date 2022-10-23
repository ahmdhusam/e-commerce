import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';
import { Trim } from 'src/shared/libs';

export class ChangePasswordDto {
  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Trim()
  @IsString()
  oldPassword: string;

  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Trim()
  @IsString()
  newPassword: string;
}
