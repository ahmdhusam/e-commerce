import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessageSerializeDto, ResponseMessage } from 'src/dtos';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto, UserLoginDto } from 'src/users/dtos';
import { UsersService } from 'src/users/services';
import { AuthService } from './auth.service';
import { AuthSerializeDto } from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'The record has been successfully created', type: () => MessageSerializeDto })
  @ApiBadRequestResponse({ description: 'Email Or username in use' })
  @UseSerialize(MessageSerializeDto)
  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<MessageSerializeDto> {
    await this.usersService.create(createUser);
    return { message: ResponseMessage.Successful };
  }

  @ApiOkResponse({ type: () => AuthSerializeDto })
  @ApiForbiddenResponse({ description: 'Password Incorrect' })
  @UseSerialize(AuthSerializeDto)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userData: UserLoginDto): Promise<AuthSerializeDto> {
    return this.authService.validateUser(userData);
  }
}
