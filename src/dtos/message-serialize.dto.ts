import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export enum ResponseMessage {
  Successful = 'successful',
  Failed = 'failed',
}

export class MessageSerializeDto {
  @ApiResponseProperty({ enum: ResponseMessage })
  @Expose()
  message: ResponseMessage;
}
