import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/shared/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators';
import { ChangePasswordDto, UpdateUserDto, UserSerializeDto } from './dtos';
import { User } from './users.entity';
import { UsersService } from './services';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MessageSerializeDto, ResponseMessage } from 'src/shared/dtos';

@ApiBearerAuth()
@UseSerialize(UserSerializeDto)
@UseAuthGuard()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: () => UserSerializeDto })
  @Get('me')
  me(@CurrentUser() currentUser: User): UserSerializeDto {
    return currentUser;
  }

  @ApiOkResponse({ type: () => UserSerializeDto })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Get(':username')
  getUser(@Param('username') username: string): Promise<UserSerializeDto> {
    return this.usersService.getOneBy({ username });
  }

  @ApiOkResponse({
    description: 'The record has been successfully updated',
    type: () => UserSerializeDto,
  })
  @ApiBadRequestResponse({ description: 'Email Or username in use' })
  @Patch('update-profile')
  updateUser(@CurrentUser() currentUser: User, @Body() userData: UpdateUserDto): Promise<UserSerializeDto> {
    return this.usersService.update(currentUser, userData);
  }

  @ApiOkResponse({
    description: 'The user password has been successfully updated',
    type: () => MessageSerializeDto,
  })
  @ApiForbiddenResponse({ description: 'Password Incorrect' })
  @Put('change-password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() passwords: ChangePasswordDto,
  ): Promise<MessageSerializeDto> {
    await this.usersService.updatePassword(currentUser, passwords.oldPassword, passwords.newPassword);

    return { message: ResponseMessage.Successful };
  }
}
