import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { ChangePassword, UpdateUser, UserSerialize } from './dtos';
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
    return this.usersService.getOneBy({ username });
  }

  @Put('update-profile')
  updateUser(@CurrentUser() currentUser: User, @Body() userData: UpdateUser): Promise<UserSerialize> {
    return this.usersService.update(currentUser, userData);
  }

  @Put('change-password')
  async changePassword(@CurrentUser() currentUser: User, @Body() passwords: ChangePassword): Promise<UserSerialize> {
    await this.usersService.validatePassword(currentUser, passwords.oldPassword);
    await this.usersService.hashPassword(currentUser, passwords.newPassword);
    return currentUser.save();
  }
}
