import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/users.entity';
import Stripe from 'stripe';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dtos';
import { Orders } from './orders.entity';
import { PaymentsService } from './services/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async checkout(user: User, orderData: CreateOrderDto): Promise<void> {
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;

    await this.entityManager
      .transaction('SERIALIZABLE', async transactionManager => {
        const total = await this.cartService.getTotalAmount(user.id);
        if (total === 0) throw new BadRequestException('cart is empty');

        paymentIntent = await this.paymentsService.createPaymentIntent(orderData.creditCard, total);

        const order = Orders.create({
          payment: paymentIntent.id,
          city: orderData.city,
          country: orderData.country,
          address: orderData.address,
          owner: user,
          total,
        });

        await transactionManager.save(order);

        await transactionManager.update(Cart, { ownerId: user.id, inOrder: false }, { inOrder: true, order });

        await this.paymentsService.confirm(paymentIntent.id);
      })
      .catch(async () => {
        if (paymentIntent) {
          await this.paymentsService.cancel(paymentIntent.id);
        }
        throw new BadRequestException();
      });
  }

  async getOrders(owner: User): Promise<Orders[]> {
    const orders = await this.ordersRepo
      .createQueryBuilder('orders')
      .select(['orders'])
      .addSelect(['product.id', 'product.title', 'product.description', 'product.price'])
      .innerJoinAndMapMany('orders.products', 'orders.cart', 'cart')
      .innerJoin('cart.product', 'product')
      .where('orders."ownerId" = :ownerId', { ownerId: owner.id })
      .getMany();

    await new Promise(r => {
      orders.forEach(order => {
        // @ts-ignore
        for (const cartItem of order.products!) {
          Object.assign(cartItem, cartItem.product);
        }
      });
      r(true);
    });

    return orders;
  }

  async deleteOneById(owner: User, orderId: number): Promise<void> {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      loadRelationIds: { relations: ['owner'] },
      relations: ['cart'],
    });
    if (!order) throw new NotFoundException('Order Not Found');

    this.isAuthorized(owner, order);

    const products = await Promise.all(
      order.cart.map(cartItem => this.productsService.reverseFromCart(cartItem.productId, cartItem.quantity)),
    );

    await this.entityManager.transaction(async transactionManager => {
      await Promise.all([transactionManager.remove(order), transactionManager.save(products)]);

      await this.paymentsService.refund(order.payment, order.total);
    });
  }

  private isAuthorized(user: User, order: Orders): void {
    if (order.owner.toString() !== user.id) throw new UnauthorizedException();
  }
}
