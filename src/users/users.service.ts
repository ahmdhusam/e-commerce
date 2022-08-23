import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from 'src/auth/dtos';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async createUser(userData: CreateUser): Promise<User> {
    userData.password = await bcrypt.hash(userData.password, 12);
    return this.userRepo
      .create(userData)
      .save()
      .catch((err: Error) => {
        if (err.message.includes('duplicate')) throw new BadRequestException('Email in use');
        else throw new BadRequestException('18 is the minimum age to register');
      });
  }
}
