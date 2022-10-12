import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthSerializeDto {
  @ApiResponseProperty()
  @Expose()
  access_token?: string;
}
