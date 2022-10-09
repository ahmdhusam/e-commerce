import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let cartRepoMock: Partial<Repository<Cart>>;
  let queryBuilderMock;
  let productsServiceMock: Partial<ProductsService>;
  let entityManagerMock: Partial<EntityManager>;

  beforeEach(async () => {
    queryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
      getRawOne: jest.fn().mockResolvedValue({}),
    };

    cartRepoMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      findOneOrFail: jest.fn().mockResolvedValue({}),
    };

    productsServiceMock = {
      reverseFromCart: jest.fn().mockResolvedValue({}),
    };

    entityManagerMock = {
      save: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: cartRepoMock },
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: getEntityManagerToken(), useValue: entityManagerMock },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cart()', () => {
    it('should call the cartRepo getRawMany method', async () => {
      await service.cart('', 0, 0);

      expect(queryBuilderMock.getRawMany).toBeCalled();
    });

    it('should call the cartRepo getRawMany method one time', async () => {
      await service.cart('', 0, 0);

      expect(queryBuilderMock.getRawMany).toBeCalledTimes(1);
    });
  });

  describe('getOne()', () => {
    it('should call the cartRepo findOneOrFail method', async () => {
      await service.getOne('', '');

      expect(cartRepoMock.findOneOrFail).toBeCalled();
    });

    it('should call the cartRepo findOneOrFail method one time', async () => {
      await service.getOne('', '');

      expect(cartRepoMock.findOneOrFail).toBeCalledTimes(1);
    });

    it('should throw not found exception if the cart item not found', () => {
      jest.spyOn(cartRepoMock, 'findOneOrFail').mockRejectedValue({});

      expect(service.getOne.bind(service, '', '')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('add()', () => {
    let cartItem: Partial<Cart>;

    beforeEach(() => {
      cartItem = { quantity: 10, inOrder: false };

      productsServiceMock.productToCart = jest.fn().mockResolvedValue({});
      cartRepoMock.findOneBy = jest.fn().mockResolvedValue(cartItem);
      cartRepoMock.create = jest.fn().mockReturnValue({});
    });

    it('should call the productsService productToCart method', async () => {
      await service.add('', '', 0);

      expect(productsServiceMock.productToCart).toBeCalled();
    });

    it('should call the productsService productToCart method one time', async () => {
      await service.add('', '', 0);

      expect(productsServiceMock.productToCart).toBeCalledTimes(1);
    });

    it('should call the cartRepo findOneBy method', async () => {
      await service.add('', '', 0);

      expect(cartRepoMock.findOneBy).toBeCalled();
    });

    it('should call the cartRepo findOneBy method one time', async () => {
      await service.add('', '', 0);

      expect(cartRepoMock.findOneBy).toBeCalledTimes(1);
    });

    it('should call the cartRepo create method when findOneBy method returned null', async () => {
      jest.spyOn(cartRepoMock, 'findOneBy').mockResolvedValue(null);

      await service.add('', '', 0);

      expect(cartRepoMock.create).toBeCalled();
    });

    it('should call the cartRepo create method one time when findOneBy method returned null', async () => {
      jest.spyOn(cartRepoMock, 'findOneBy').mockResolvedValue(null);

      await service.add('', '', 0);

      expect(cartRepoMock.create).toBeCalledTimes(1);
    });

    it('should throw bad request exception if the cart item inorder', () => {
      jest.spyOn(cartRepoMock, 'findOneBy').mockResolvedValue({ inOrder: true } as Cart);

      expect(service.add.bind(service, '', '', 0)).rejects.toThrowError(BadRequestException);
    });

    it('should add quantity to cart item quantity if the cart item is not inorder', async () => {
      const quantity = 5;
      const cartItemQuantity = cartItem.quantity;

      await service.add('', '', quantity);

      expect(cartItem.quantity).toBe(cartItemQuantity + quantity);
    });

    it('should call the entityManager save method', async () => {
      await service.add('', '', 0);

      expect(entityManagerMock.save).toBeCalled();
    });

    it('should call the entityManager save method one time', async () => {
      await service.add('', '', 0);

      expect(entityManagerMock.save).toBeCalledTimes(1);
    });
  });

  describe('reverse()', () => {
    let cartItem: Partial<Cart>;
    beforeEach(() => {
      cartItem = { quantity: 10 };

      jest.spyOn(service, 'getOne').mockResolvedValue(cartItem as Cart);
    });

    it('should call the cartService getOne method', async () => {
      await service.reverse('', '', 0);

      expect(service.getOne).toBeCalled();
    });

    it('should call the cartService getOne method one time', async () => {
      await service.reverse('', '', 0);

      expect(service.getOne).toBeCalledTimes(1);
    });

    it('should call the productsService reverseFromCart method', async () => {
      await service.reverse('', '', 0);

      expect(productsServiceMock.reverseFromCart).toBeCalled();
    });

    it('should call the productsService reverseFromCart method one time', async () => {
      await service.reverse('', '', 0);

      expect(productsServiceMock.reverseFromCart).toBeCalledTimes(1);
    });

    it('should throw bad request exception if the cart item quantity smaller than the quantity', () => {
      const cartItemQuantity = 10;
      const quantity = 11;
      cartItem.quantity = cartItemQuantity;

      expect(service.reverse('', '', quantity)).rejects.toThrowError(BadRequestException);
    });

    it('should call the cartService delete method if the cart item quantity equal the quantity', async () => {
      const cartItemQuantity = 10;
      const quantity = 10;
      cartItem.quantity = cartItemQuantity;

      jest.spyOn(service, 'delete').mockResolvedValue();
      await service.reverse('', '', quantity);

      expect(service.delete).toBeCalled();
    });

    it('should call the cartService delete method one time if the cart item quantity equal the quantity', async () => {
      const cartItemQuantity = 10;
      const quantity = 10;
      cartItem.quantity = cartItemQuantity;

      jest.spyOn(service, 'delete').mockResolvedValue();
      await service.reverse('', '', quantity);

      expect(service.delete).toBeCalledTimes(1);
    });

    it('should not call the entityManager save method if the cart item quantity equal the quantity', async () => {
      const cartItemQuantity = 10;
      const quantity = 10;
      cartItem.quantity = cartItemQuantity;

      jest.spyOn(service, 'delete').mockResolvedValue();
      await service.reverse('', '', quantity);

      expect(entityManagerMock.save).not.toBeCalled();
    });

    it('should subtract the quantity from the cart itme quantity', async () => {
      const cartItemQuantity = 10;
      const quantity = 5;
      cartItem.quantity = cartItemQuantity;

      await service.reverse('', '', quantity);

      expect(cartItem.quantity).toBe(cartItemQuantity - quantity);
    });

    it('should call the entityManager save method', async () => {
      await service.reverse('', '', 0);

      expect(entityManagerMock.save).toBeCalled();
    });

    it('should call the entityManager save method one time', async () => {
      await service.reverse('', '', 0);

      expect(entityManagerMock.save).toBeCalledTimes(1);
    });
  });

  describe('delete()', () => {
    let transactionManager;

    beforeEach(() => {
      transactionManager = {
        remove: jest.fn().mockResolvedValue({}),
        save: jest.fn().mockResolvedValue({}),
      };

      entityManagerMock.transaction = jest.fn().mockImplementation(async callBack => {
        await callBack(transactionManager);
      });

      jest.spyOn(service, 'getOne').mockResolvedValue({} as Cart);
    });

    it('should call the cartService getOne method', async () => {
      await service.delete('', '');

      expect(service.getOne).toBeCalled();
    });

    it('should call the cartService getOne method one time', async () => {
      await service.delete('', '');

      expect(service.getOne).toBeCalledTimes(1);
    });

    it('should call the productsService reverseFromCart method', async () => {
      await service.delete('', '');

      expect(productsServiceMock.reverseFromCart).toBeCalled();
    });

    it('should call the productsService reverseFromCart method one time', async () => {
      await service.delete('', '');

      expect(productsServiceMock.reverseFromCart).toBeCalledTimes(1);
    });

    it('should call the entityManager transaction method', async () => {
      await service.delete('', '');

      expect(entityManagerMock.transaction).toBeCalled();
    });

    it('should call the entityManager transaction method one time', async () => {
      await service.delete('', '');

      expect(entityManagerMock.transaction).toBeCalledTimes(1);
    });

    it('should call the transactionManager remove method', async () => {
      await service.delete('', '');

      expect(transactionManager.remove).toBeCalled();
    });

    it('should call the transactionManager remove method one time', async () => {
      await service.delete('', '');

      expect(transactionManager.remove).toBeCalledTimes(1);
    });

    it('should call the transactionManager save method', async () => {
      await service.delete('', '');

      expect(transactionManager.save).toBeCalled();
    });

    it('should call the transactionManager save method one time', async () => {
      await service.delete('', '');

      expect(transactionManager.save).toBeCalledTimes(1);
    });
  });

  describe('getTotalAmount()', () => {
    it('should call the cartRepo getRawOne method', async () => {
      await service.getTotalAmount('');

      expect(queryBuilderMock.getRawOne).toBeCalled();
    });

    it('should call the cartRepo getRawOne method one time', async () => {
      await service.getTotalAmount('');

      expect(queryBuilderMock.getRawOne).toBeCalledTimes(1);
    });

    it('should return 0 if total is null', async () => {
      const result = await service.getTotalAmount('');

      expect(result).toBe(0);
    });

    it('should return 0 if total is not positive', async () => {
      queryBuilderMock.getRawOne = jest.fn().mockResolvedValue({ total: 0 });
      const result = await service.getTotalAmount('');

      expect(result).toBe(0);
    });
  });
});
