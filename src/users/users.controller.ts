import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { ChangePasswordDto, UpdateUserDto, UserSerializeDto } from './dtos';
import { User } from './users.entity';
import { UsersService } from './services';
import { ResponseMessage } from 'src/types';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
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

  @Patch('update-profile')
  updateUser(@CurrentUser() currentUser: User, @Body() userData: UpdateUserDto): Promise<UserSerializeDto> {
    return this.usersService.update(currentUser, userData);
  }

  @Put('change-password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() passwords: ChangePasswordDto,
  ): Promise<ResponseMessage> {
    await this.usersService.updatePassword(currentUser, passwords.oldPassword, passwords.newPassword);

    return { message: 'successful' };
  }
}
