import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dtos';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';
import { PaymentsService } from './services/payments.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let entityManager: EntityManager;
  let ordersRepo: Repository<Orders>;
  // let productsService: ProductsService;
  let cartService: CartService;
  let paymentsService: PaymentsService;
  let transactionManager: Partial<EntityManager>;

  beforeEach(async () => {
    transactionManager = {
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getEntityManagerToken(),
          useValue: {
            transaction: jest.fn().mockImplementation(async (_iL: string, callback) => {
              await callback(transactionManager);
            }),
          },
        },
        { provide: getRepositoryToken(Orders), useValue: { create: jest.fn() } },
        { provide: ProductsService, useValue: {} },
        { provide: CartService, useValue: { getTotalAmount: jest.fn().mockResolvedValue(100) } },
        {
          provide: PaymentsService,
          useValue: { createPaymentIntent: jest.fn().mockResolvedValue({}), confirm: jest.fn(), cancel: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    entityManager = module.get<EntityManager>(EntityManager);
    ordersRepo = module.get<Repository<Orders>>(getRepositoryToken(Orders));
    // productsService = module.get<ProductsService>(ProductsService);
    cartService = module.get<CartService>(CartService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout()', () => {
    const user = {} as User;
    const orderData = {} as CreateOrderDto;

    it('should call the entityManager transaction method', async () => {
      await service.checkout(user, orderData);

      expect(entityManager.transaction).toBeCalled();
    });

    it('should call the entityManager transaction method one time', async () => {
      await service.checkout(user, orderData);

      expect(entityManager.transaction).toBeCalledTimes(1);
    });

    it('should call the cartService getTotalAmount method', async () => {
      await service.checkout(user, orderData);

      expect(cartService.getTotalAmount).toBeCalled();
    });

    it('should call the cartService getTotalAmount method one time', async () => {
      await service.checkout(user, orderData);

      expect(cartService.getTotalAmount).toBeCalledTimes(1);
    });

    it('should throw bad request exception if the getTotalAmount method return 0', () => {
      jest.spyOn(cartService, 'getTotalAmount').mockResolvedValue(0);

      expect(service.checkout.bind(service, user, orderData)).rejects.toThrowError(BadRequestException);
    });

    it('should call the paymentsService createPaymentIntent method', async () => {
      await service.checkout(user, orderData);

      expect(paymentsService.createPaymentIntent).toBeCalled();
    });

    it('should call the paymentsService createPaymentIntent method one time', async () => {
      await service.checkout(user, orderData);

      expect(paymentsService.createPaymentIntent).toBeCalledTimes(1);
    });

    it('should call the ordersRepo create method', async () => {
      await service.checkout(user, orderData);

      expect(ordersRepo.create).toBeCalled();
    });

    it('should call the ordersRepo create method one time', async () => {
      await service.checkout(user, orderData);

      expect(ordersRepo.create).toBeCalledTimes(1);
    });

    it('should call the transactionManager save method', async () => {
      await service.checkout(user, orderData);

      expect(transactionManager.save).toBeCalled();
    });

    it('should call the transactionManager save method one time', async () => {
      await service.checkout(user, orderData);

      expect(transactionManager.save).toBeCalledTimes(1);
    });

    it('should call the transactionManager update method', async () => {
      await service.checkout(user, orderData);

      expect(transactionManager.update).toBeCalled();
    });

    it('should call the transactionManager update method one time', async () => {
      await service.checkout(user, orderData);

      expect(transactionManager.update).toBeCalledTimes(1);
    });

    it('should call the paymentsService confirm method', async () => {
      await service.checkout(user, orderData);

      expect(paymentsService.confirm).toBeCalled();
    });

    it('should call the paymentsService confirm method one time', async () => {
      await service.checkout(user, orderData);

      expect(paymentsService.confirm).toBeCalledTimes(1);
    });

    it('should throw bad request exception if the transactionManager method failed', () => {
      jest.spyOn(paymentsService, 'createPaymentIntent').mockRejectedValue({});

      expect(service.checkout.bind(service, user, orderData)).rejects.toThrowError(BadRequestException);
    });

    it('should not call the paymentsService cancel method if any method failed before create payment intent', async () => {
      jest.spyOn(paymentsService, 'createPaymentIntent').mockRejectedValue({});

      await service.checkout(user, orderData).catch(() => {});

      expect(paymentsService.cancel).not.toBeCalled();
    });

    it('should call the paymentsService cancel method if any method failed after created payment intent', async () => {
      jest.spyOn(transactionManager, 'save').mockRejectedValue({});

      await service.checkout(user, orderData).catch(() => {});

      expect(paymentsService.cancel).toBeCalled();
    });

    it('should call the paymentsService cancel method one time if any method failed after created payment intent', async () => {
      jest.spyOn(transactionManager, 'save').mockRejectedValue({});

      await service.checkout(user, orderData).catch(() => {});

      expect(paymentsService.cancel).toBeCalledTimes(1);
    });
  });
});
