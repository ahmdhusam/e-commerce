import { Controller, Get } from '@nestjs/common';
import { UserSerialize } from 'src/auth/dtos';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { User } from './users.entity';

@UseSerialize(UserSerialize)
@Controller('users')
export class UsersController {
  @Get('me')
  me(@CurrentUser() currentUser: User): UserSerialize {
    return currentUser;
  }
}
