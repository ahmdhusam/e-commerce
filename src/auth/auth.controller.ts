import { Body, Controller, Post } from '@nestjs/common';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUser, User, UserLogin } from './dtos';

@UseSerialize(User)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUser: CreateUser): Promise<User> {
    return this.usersService.createUser(createUser);
  }

  @Post('login')
  login(@Body() userData: UserLogin): Promise<User> {
    return this.authService.validateUser(userData);
  }
}
