import { Body, Controller, Post } from '@nestjs/common';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { UserSerializeDto } from 'src/users/dtos';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto, UserLoginDto } from './dtos';

@UseSerialize(UserSerializeDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<UserSerializeDto> {
    return this.usersService.create(createUser);
  }

  @Post('login')
  login(@Body() userData: UserLoginDto): Promise<UserSerializeDto> {
    return this.authService.validateUser(userData);
  }
}
