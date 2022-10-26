import { Body, Controller, Get, Param, Patch, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserImages } from './interfaces/user-image.interface';
import { ParseImagesPipe } from 'src/shared/pipes';
import { ImagesService } from 'src/shared/services';

@ApiBearerAuth()
@UseSerialize(UserSerializeDto)
@UseAuthGuard()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly imagesService: ImagesService) {}

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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'header', maxCount: 1 },
    ]),
  )
  @Patch('update-profile')
  async updateUser(
    @CurrentUser() currentUser: User,
    @Body() userData: UpdateUserDto,
    @UploadedFiles(ParseImagesPipe) userImages: UserImages,
  ): Promise<UserSerializeDto> {
    for (const fieldName in userImages) {
      [userData[fieldName]] = userImages[fieldName];

      if (currentUser[fieldName]) await this.imagesService.deleteImage(currentUser[fieldName]);
    }

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
