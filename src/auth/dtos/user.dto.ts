import { Expose } from 'class-transformer';

export class User {
  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  birthDate: Date;

  @Expose()
  lat: number;

  @Expose()
  lng: number;
}
