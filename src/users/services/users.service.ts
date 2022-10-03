import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { CryptoService } from './crypto.service';

@Injectable()
export class UsersService {
  private readonly salt = 12;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create(userData);

    newUser.password = await this.cryptoService.hash(userData.password, this.salt);

    return newUser.save().catch((err: Error) => {
      if (err.message.includes('duplicate')) throw new BadRequestException('Email Or username in use');
      else throw new BadRequestException('18 is the minimum age to register');
    });
  }

  update(currentUser: User, userData: UpdateUserDto): Promise<User> {
    Object.assign(currentUser, userData);
    return currentUser.save().catch((err: Error) => {
      if (err.message.includes('duplicate')) throw new BadRequestException('Email Or username in use');
      else throw new BadRequestException('18 is the minimum age to register');
    });
  }

  getOneBy(userData: Partial<Pick<User, 'id' | 'email' | 'username'>>): Promise<User> {
    return this.userRepo.findOneByOrFail(userData).catch(() => {
      throw new NotFoundException('user Not Found');
    });
  }

  async validatePassword(user: User, password: string): Promise<void> {
    const isValid = await this.cryptoService.compare(password, user.password);
    if (!isValid) throw new ForbiddenException('password incorrect');
  }

  async updatePassword(user: User, oldPassword: string, newPassword: string): Promise<void> {
    await this.validatePassword(user, oldPassword);

    user.password = await this.cryptoService.hash(newPassword, this.salt);

    await user.save();
  }
}
