import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { CreateUser } from 'src/auth/dtos';
import { UpdateUser } from './dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async create(userData: CreateUser): Promise<User> {
    const newUser = this.userRepo.create(userData);

    await this.hashPassword(newUser, userData.password);

    return newUser.save().catch((err: Error) => {
      if (err.message.includes('duplicate')) throw new BadRequestException('Email Or username in use');
      else throw new BadRequestException('18 is the minimum age to register');
    });
  }

  update(currentUser: User, userData: UpdateUser): Promise<User> {
    Object.assign(currentUser, userData);
    return currentUser.save();
  }

  getOneBy(userData: Partial<Pick<User, 'id' | 'email' | 'username'>>): Promise<User> {
    return this.userRepo.findOneByOrFail(userData).catch(() => {
      throw new NotFoundException('user Not Found');
    });
  }

  async validatePassword(currentUser: User, password: string): Promise<void> {
    const isValid = await bcrypt.compare(password, currentUser.password);
    if (!isValid) throw new ForbiddenException('password incorrect');
  }

  async hashPassword(currentUser: User, password: string): Promise<User> {
    currentUser.password = await bcrypt.hash(password, 12);
    return currentUser;
  }
}
