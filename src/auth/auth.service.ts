import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services';
import { UserLoginDto } from 'src/users/dtos';
import { AuthSerializeDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly JwtService: JwtService) {}

  async validateUser({ email, password }: UserLoginDto): Promise<AuthSerializeDto> {
    const user = await this.usersService.getOneBy({ email: email });

    await this.usersService.validatePassword(user, password);

    return this.makeToken(user.id, user.email);
  }

  makeToken(id: string, email: string): AuthSerializeDto {
    const payload = { sub: id, email };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
