import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isPositive } from 'class-validator';
import { InjectStripe } from 'nestjs-stripe';
import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/users/users.entity';
import Stripe from 'stripe';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dtos';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectStripe() private readonly stripe: Stripe,
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
  ) {}

  async checkout(user: User, orderData: CreateOrderDto): Promise<void> {
    let { total }: { total: number } = await this.entityManager
      .createQueryBuilder(Cart, 'cart')
      .select('SUM(cart.quantity * product.price)', 'total')
      .innerJoin('cart.product', 'product')
      .where('cart.owner_id = :ownerId', { ownerId: user.id })
      .andWhere('cart.in_order = false')
      .getRawOne();

    if (!isPositive(total)) throw new BadRequestException();
    total = +total.toFixed(2);

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: orderData.cardNumber,
        cvc: orderData.cardCvc,
        exp_month: orderData.cardExpMonth,
        exp_year: orderData.cardExpYear,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'usd',
      confirm: true,
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
    });

    const order = Orders.create({
      payment: paymentIntent.id,
      city: orderData.city,
      country: orderData.country,
      address: orderData.address,
      owner: user,
      total,
    });

    await this.entityManager.transaction('SERIALIZABLE', async transactionManager => {
      await transactionManager.save(order);

      await transactionManager.update(Cart, { ownerId: user.id, inOrder: false }, { inOrder: true, order });
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
}
