import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/services';
import { DeepPartial } from 'typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: DeepPartial<UsersService>;

  beforeEach(async () => {
    usersServiceMock = {
      getOneBy: jest.fn().mockReturnValue({ id: '', email: '' }),
      validatePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'makeToken').mockReturnValue({ access_token: '' });
    });

    it('should call the usersService getOneBy method', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(usersServiceMock.getOneBy).toBeCalled();
    });

    it('should call the usersService getOneBy method one time', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(usersServiceMock.getOneBy).toBeCalledTimes(1);
    });

    it('should call the usersService validatePassword method', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(usersServiceMock.validatePassword).toBeCalled();
    });

    it('should call the usersService validatePassword method one time', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(usersServiceMock.validatePassword).toBeCalledTimes(1);
    });

    it('should call the makeToken method', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(service.makeToken).toBeCalled();
    });

    it('should call the makeToken method one time', async () => {
      await service.validateUser({ email: '', password: '' });

      expect(service.makeToken).toBeCalledTimes(1);
    });
  });
});
