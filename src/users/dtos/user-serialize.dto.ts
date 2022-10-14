import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserSerializeDto {
  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  username: string;

  @ApiResponseProperty()
  @Expose()
  email: string;
}
