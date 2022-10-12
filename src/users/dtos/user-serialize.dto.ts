import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserSerializeDto {
  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  username: string;

  @Expose()
  email: string;

  @ApiResponseProperty()
  @Expose()
  birthDate: Date;

  @ApiResponseProperty()
  @Expose()
  lat: number;

  @ApiResponseProperty()
  @Expose()
  lng: number;
}
