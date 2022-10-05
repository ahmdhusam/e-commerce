/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      findOneOrFail: jest.fn().mockResolvedValue({} as Product),
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

    it('should call the getOneById method', async () => {
      await service.update({} as User, '', {});

      expect(getOneByIdMock).toBeCalled();
    });

    it('should call the getOneById method one time', async () => {
      await service.update({} as User, '', {});

      expect(getOneByIdMock).toBeCalledTimes(1);
    });

    it('should call the isAuthorized method method', async () => {
      await service.update({} as User, '', {});

      expect(isAuthorizedMock).toBeCalled();
    });

    it('should call the isAuthorized method one time', async () => {
      await service.update({} as User, '', {});

      expect(isAuthorizedMock).toBeCalledTimes(1);
    });

    it('should return the product data', async () => {
      const result = await service.productToCart('', 0);

      expect(result).toBeDefined();
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

  describe('productToCart()', () => {
    let getOneByIdMock;
    let product: Partial<Product>;

    beforeEach(() => {
      product = {
        quantity: 100,
        inOrder: 0,
      };

      getOneByIdMock = jest.spyOn(service, 'getOneById').mockResolvedValue(product as Product);
    });

    it('should call the getOneById method By id', async () => {
      await service.productToCart('', 0);

      expect(getOneByIdMock).toBeCalled();
    });

    it('should call the getOneById method one time', async () => {
      await service.productToCart('', 0);

      expect(getOneByIdMock).toBeCalledTimes(1);
    });

    it('should return the product data', async () => {
      const result = await service.productToCart('', 0);

      expect(result).toBeDefined();
      expect(result).toMatchObject(product);
    });

    it('should throw bad request exception if the quantity of the product smaller than the quantity', () => {
      product.quantity = 10;
      const quantity = 11;

      expect(service.productToCart.bind(service, '', quantity)).rejects.toThrowError(BadRequestException);
    });

    it('should subtract the quantity from the quantity of the product', async () => {
      const productQuantity = 10;
      const quantity = 5;
      product.quantity = productQuantity;

      const result = await service.productToCart('', quantity);

      expect(result.quantity).toBe(productQuantity - quantity);
    });

    it('should added the quantity to the inorder quantity of the product', async () => {
      const inOrderQuantity = 10;
      const quantity = 5;
      product.inOrder = inOrderQuantity;

      const result = await service.productToCart('', quantity);

      expect(result.inOrder).toBe(inOrderQuantity + quantity);
    });
  });

  describe('reverseFromCart()', () => {
    let getOneByIdMock;
    let product: Partial<Product>;

    beforeEach(() => {
      product = {
        quantity: 100,
        inOrder: 50,
      };

      getOneByIdMock = jest.spyOn(service, 'getOneById').mockResolvedValue(product as Product);
    });

    it('should call the getOneById method By id', async () => {
      await service.productToCart('', 0);

      expect(getOneByIdMock).toBeCalled();
    });

    it('should call the getOneById method one time', async () => {
      await service.reverseFromCart('', 0);

      expect(getOneByIdMock).toBeCalledTimes(1);
    });

    it('should return the product data', async () => {
      const result = await service.reverseFromCart('', 0);

      expect(result).toBeDefined();
      expect(result).toMatchObject(product);
    });

    it('should throw bad request exception if the inorder quantity of the product smaller than the quantity', () => {
      product.inOrder = 10;
      const quantity = 11;

      expect(service.reverseFromCart.bind(service, '', quantity)).rejects.toThrowError(BadRequestException);
    });

    it('should subtract the quantity from the inorder quantity of the product', async () => {
      const inOrderQuantity = 10;
      const quantity = 5;
      product.inOrder = inOrderQuantity;

      const result = await service.reverseFromCart('', quantity);

      expect(result.inOrder).toBe(inOrderQuantity - quantity);
    });

    it('should added the quantity to the quantity of the product', async () => {
      const productQuantity = 10;
      const quantity = 5;
      product.quantity = productQuantity;

      const result = await service.reverseFromCart('', quantity);

      expect(result.quantity).toBe(productQuantity + quantity);
    });
  });

  describe('delete()', () => {
    let getOneByIdMock;
    let isAuthorizedMock;

    beforeEach(() => {
      getOneByIdMock = jest.spyOn(service, 'getOneById').mockImplementation(() => {
        const product: DeepPartial<Product> = {
          remove: jest.fn().mockImplementation(() => Promise.resolve(product)),
        };

        return Promise.resolve(product as Product);
      });

      isAuthorizedMock = jest.spyOn(service, 'isAuthorized').mockImplementation(() => {});
    });

    it('should call the getOneById method', async () => {
      await service.delete({} as User, '');

      expect(getOneByIdMock).toBeCalled();
    });

    it('should call the getOneById method one time', async () => {
      await service.delete({} as User, '');

      expect(getOneByIdMock).toBeCalledTimes(1);
    });

    it('should call the isAuthorized method method', async () => {
      await service.delete({} as User, '');

      expect(isAuthorizedMock).toBeCalled();
    });

    it('should call the isAuthorized method one time', async () => {
      await service.delete({} as User, '');

      expect(isAuthorizedMock).toBeCalledTimes(1);
    });

    it('should return the product data', async () => {
      const result = await service.delete({} as User, '');

      expect(result).toBeDefined();
    });

    it('should call the remove method', async () => {
      const result = await service.delete({} as User, '');

      expect(result.remove).toBeCalled();
    });

    it('should call the remove method one time', async () => {
      const result = await service.delete({} as User, '');

      expect(result.remove).toBeCalledTimes(1);
    });
  });

  describe('isAuthorized()', () => {
    it('should throw unauthorized exception if the user is not the author of the product', () => {
      const userId = '1';
      const authorId = '5';

      expect(
        service.isAuthorized.bind(service, { id: userId } as User, { author: { id: authorId } } as Product),
      ).toThrowError(UnauthorizedException);
    });

    it('should pass if the user is the author of the product', () => {
      const userId = '1';
      const authorId = '1';

      expect(
        service.isAuthorized.bind(service, { id: userId } as User, { author: { id: authorId } } as Product),
      ).not.toThrowError(UnauthorizedException);
    });
  });

  describe('getOneById()', () => {
    const validUUIDv4 = 'fb0406bf-7d53-4fc4-b774-be7c9bd60174';

    it('should throw bad request exception if the productId is not UUIDv4', async () => {
      expect(service.getOneById.bind(service, '1298a837-1239f9')).rejects.toThrowError(BadRequestException);
    });

    it('should call the productsRepo findOneOrFail method', async () => {
      await service.getOneById(validUUIDv4);

      expect(productsRepoMock.findOneOrFail).toBeCalled();
    });

    it('should call the productsRepo findOneOrFail method one time', async () => {
      await service.getOneById(validUUIDv4);

      expect(productsRepoMock.findOneOrFail).toBeCalledTimes(1);
    });

    it('should throw not found exception if product not found', () => {
      productsRepoMock.findOneOrFail = jest.fn().mockRejectedValue({});

      expect(service.getOneById.bind(service, validUUIDv4)).rejects.toThrowError(NotFoundException);
    });

    it('should return the product data', async () => {
      const result = await service.getOneById(validUUIDv4);

      expect(result).toBeDefined();
    });
  });
});
