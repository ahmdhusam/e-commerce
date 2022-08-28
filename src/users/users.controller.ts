import { Controller, Get, Param } from '@nestjs/common';
import { UserSerialize } from 'src/auth/dtos';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { User } from './users.entity';
import { UsersService } from './users.service';

@UseSerialize(UserSerialize)
@UseAuthGuard()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() currentUser: User): UserSerialize {
    return currentUser;
  }

  @Get(':username')
  getUser(@Param('username') username: string): Promise<UserSerialize> {
    return this.usersService.getUserBy({ username });
  }
}
