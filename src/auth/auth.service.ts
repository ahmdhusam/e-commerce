import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { UserLogin } from './dtos';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly JwtService: JwtService) {}

  async validateUser({ email, password }: UserLogin): Promise<User & { access_token: string }> {
    const user = await this.usersService.getOneBy({ email: email });

    await this.usersService.validatePassword(user, password);

    return Object.assign(user, this.makeToken(user.id, user.email));
  }

  makeToken(id: string, email: string): { access_token: string } {
    const payload = { sub: id, email };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
