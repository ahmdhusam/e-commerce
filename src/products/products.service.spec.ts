/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ProductDataDto } from './dtos';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepoMock: DeepPartial<Repository<Product>>;

  beforeEach(async () => {
    productsRepoMock = {
      create: jest.fn().mockImplementation((productData: ProductDataDto) => {
        const createdProduct = {
          ...productData,
          save: jest.fn().mockImplementation(() => Promise.resolve(createdProduct)),
        };
        return createdProduct;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, { provide: getRepositoryToken(Product), useValue: productsRepoMock }],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should call productsRepo create method', async () => {
      await service.create({} as User, {} as ProductDataDto);

      expect(productsRepoMock.create).toBeCalled();
    });

    it('should call productsRepo create method one time', async () => {
      await service.create({} as User, {} as ProductDataDto);

      expect(productsRepoMock.create).toBeCalledTimes(1);
    });

    it('should call save method', async () => {
      const newProduct = await service.create({} as User, {} as ProductDataDto);

      expect(newProduct.save).toBeCalled();
    });

    it('should call save method one time', async () => {
      const newProduct = await service.create({} as User, {} as ProductDataDto);

      expect(newProduct.save).toBeCalledTimes(1);
    });
  });

  describe('update()', () => {
    let getOneByIdMock;
    let isAuthorizedMock;

    beforeEach(() => {
      getOneByIdMock = jest.spyOn(service, 'getOneById').mockImplementation(() => {
        const product: DeepPartial<Product> = {
          save: jest.fn().mockImplementation(() => Promise.resolve(product)),
        };

        return Promise.resolve(product as Product);
      });

      isAuthorizedMock = jest.spyOn(service, 'isAuthorized').mockImplementation(() => {});
    });

    it('should call getOneById method', async () => {
      await service.update({} as User, '', {});

      expect(getOneByIdMock).toBeCalled();
    });

    it('should call getOneById one time', async () => {
      await service.update({} as User, '', {});

      expect(getOneByIdMock).toBeCalledTimes(1);
    });

    it('should call isAuthorized method', async () => {
      await service.update({} as User, '', {});

      expect(isAuthorizedMock).toBeCalled();
    });

    it('should call isAuthorized one time', async () => {
      await service.update({} as User, '', {});

      expect(isAuthorizedMock).toBeCalledTimes(1);
    });

    it('should call the save method', async () => {
      const result = await service.update({} as User, '', {});

      expect(result.save).toBeCalled();
    });

    it('should call the save method one time', async () => {
      const result = await service.update({} as User, '', {});

      expect(result.save).toBeCalledTimes(1);
    });

    it('should assign productData to result', async () => {
      const productData: Omit<UpdateProductDto, 'id'> = {
        title: 'product Title',
        quantity: 100,
      };

      const result = await service.update({} as User, '', productData);

      expect(result).toMatchObject(productData);
      expect(result.title).toBe(productData.title);
      expect(result.quantity).toBe(productData.quantity);
    });
  });
});
