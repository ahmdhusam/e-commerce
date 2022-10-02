import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isPositive } from 'class-validator';
import { InjectStripe } from 'nestjs-stripe';
import { Cart } from 'src/cart/cart.entity';
import { ProductsService } from 'src/products/products.service';
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
    private readonly productsService: ProductsService,
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

    const amount = total * 100;
    // Stripe Processing Fees (2.9% + $0.30)
    const calcSPFees = Math.trunc(amount * 0.03) + 30;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount + calcSPFees,
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

  async deleteById(owner: User, orderId: number): Promise<void> {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      loadRelationIds: { relations: ['owner'] },
      relations: ['cart'],
    });
    if (!order) throw new NotFoundException('Order Not Found');
    if (order.owner.toString() !== owner.id) throw new UnauthorizedException();

    const products = await Promise.all(
      order.cart.map(cartItem => this.productsService.reverseFromCart(cartItem.productId, cartItem.quantity)),
    );

    await this.entityManager.transaction(async transactionManager => {
      await Promise.all([transactionManager.remove(order), transactionManager.save(products)]);

      await this.stripe.refunds.create({ payment_intent: order.payment, amount: +order.total * 100 });
    });
  }
}
