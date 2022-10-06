import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { CreditCardDto } from '../dtos';

@Injectable()
export class PaymentsService {
  constructor(@InjectStripe() private readonly stripe: Stripe) {}

  async createPaymentIntent(creditCard: CreditCardDto, total: number): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: creditCard.number,
        cvc: creditCard.cvc,
        exp_month: creditCard.expMonth,
        exp_year: creditCard.expYear,
      },
    });

    const amount = total * 100;

    return this.stripe.paymentIntents.create({
      amount: amount + this.calcStripeProcessingFees(amount),
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
    });
  }

  confirm(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  cancel(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  refund(paymentIntentId: string, total: number): Promise<Stripe.Response<Stripe.Refund>> {
    return this.stripe.refunds.create({ payment_intent: paymentIntentId, amount: +total * 100 });
  }

  private calcStripeProcessingFees(amount: number): number {
    // Stripe Processing Fees (2.9% + $0.30)
    return Math.trunc(amount * 0.03) + 30;
  }
}
