import { Body, Controller, Post } from '@nestjs/common';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto, UserLoginDto, UserSerializeDto } from 'src/users/dtos';
import { UsersService } from 'src/users/services';
import { AuthService } from './auth.service';

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
