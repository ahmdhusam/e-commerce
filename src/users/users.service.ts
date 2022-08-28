import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { CreateUser } from 'src/auth/dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async createUser(userData: CreateUser): Promise<User> {
    userData.password = await bcrypt.hash(userData.password, 12);
    return this.userRepo
      .create(userData)
      .save()
      .catch((err: Error) => {
        if (err.message.includes('duplicate')) throw new BadRequestException('Email Or username in use');
        else throw new BadRequestException('18 is the minimum age to register');
      });
  }

  getUserBy(userData: Partial<Pick<User, 'id' | 'email' | 'username'>>): Promise<User> {
    return this.userRepo.findOneByOrFail(userData).catch(() => {
      throw new NotFoundException('user Not Found');
    });
  }
}
