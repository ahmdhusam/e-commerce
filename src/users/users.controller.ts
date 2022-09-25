import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { ChangePasswordDto, UpdateUserDto, UserSerializeDto } from './dtos';
import { User } from './users.entity';
import { UsersService } from './users.service';

@UseSerialize(UserSerializeDto)
@UseAuthGuard()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() currentUser: User): UserSerializeDto {
    return currentUser;
  }

  @Get(':username')
  getUser(@Param('username') username: string): Promise<UserSerializeDto> {
    return this.usersService.getOneBy({ username });
  }

  @Put('update-profile')
  updateUser(@CurrentUser() currentUser: User, @Body() userData: UpdateUserDto): Promise<UserSerializeDto> {
    return this.usersService.update(currentUser, userData);
  }

  @Put('change-password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() passwords: ChangePasswordDto,
  ): Promise<UserSerializeDto> {
    await this.usersService.validatePassword(currentUser, passwords.oldPassword);
    await this.usersService.hashPassword(currentUser, passwords.newPassword);
    return currentUser.save();
  }
}
