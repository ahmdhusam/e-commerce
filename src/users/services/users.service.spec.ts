/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../users.entity';
import { CryptoService } from './crypto.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepoMock: DeepPartial<Repository<User>> = {};

  beforeEach(async () => {
    userRepoMock = {
      create: (userData: Partial<User>) => ({
        ...userData,
        save: function () {
          return Promise.resolve(this);
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoService, { provide: getRepositoryToken(User), useValue: userRepoMock }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should return hashed password', async () => {
      const password = 'fakepassword';

      const newUser = await service.create({ password } as CreateUserDto);

      expect(newUser.password).not.toBe(password);
    });

    it('should throw bad request exception if the user email or username existed', async () => {
      userRepoMock.create = (userData: Partial<User>) => ({
        ...userData,
        save: function () {
          return Promise.reject(new Error('duplicate'));
        },
      });

      expect(service.create.bind(service, { password: 'asd' } as CreateUserDto)).rejects.toThrowError(
        'Email Or username in use',
      );
    });

    it('should throw bad request exception if the user is under 18', async () => {
      userRepoMock.create = (userData: Partial<User>) => ({
        ...userData,
        save: function () {
          return Promise.reject(new Error());
        },
      });

      expect(service.create.bind(service, { password: 'asd' } as CreateUserDto)).rejects.toThrowError(
        '18 is the minimum age to register',
      );
    });
  });

  describe('update()', () => {
    let user: DeepPartial<User>;

    beforeEach(() => {
      user = {
        save: function () {
          return Promise.resolve(this);
        },
      };
    });

    it('should update the user data', async () => {
      const userData: UpdateUserDto = {
        email: 'ahmdhusam7@gmail.com',
        username: 'ahmdhusam',
      };

      const result = await service.update(user as User, userData);

      expect(result).toMatchObject(userData);
      expect(result.email).toBe(userData.email);
      expect(result.username).toBe(userData.username);
    });

    it('should throw bad request exception if the user email or username existed', async () => {
      user.save = () => Promise.reject(new Error('duplicate'));

      expect(service.update.bind(service, user as User, {} as UpdateUserDto)).rejects.toThrowError(
        'Email Or username in use',
      );
    });

    it('should throw bad request exception if the user is under 18', async () => {
      user.save = () => Promise.reject(new Error());

      expect(service.update.bind(service, user as User, {} as UpdateUserDto)).rejects.toThrowError(
        '18 is the minimum age to register',
      );
    });
  });
});
