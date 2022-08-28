import { Body, Controller, Post } from '@nestjs/common';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUser, UserSerialize, UserLogin } from './dtos';

@UseSerialize(UserSerialize)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUser: CreateUser): Promise<UserSerialize> {
    return this.usersService.createUser(createUser);
  }

  @Post('login')
  login(@Body() userData: UserLogin): Promise<UserSerialize> {
    return this.authService.validateUser(userData);
  }
}
