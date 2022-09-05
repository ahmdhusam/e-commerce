import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/cart.service';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    private readonly cartService: CartService,
  ) {}
}
