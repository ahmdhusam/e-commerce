import { Body, Controller, Post } from '@nestjs/common';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { CreateUser, User } from './dtos';

@UseSerialize(User)
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUser: CreateUser): Promise<User> {
    return this.usersService.createUser(createUser);
  }
}
