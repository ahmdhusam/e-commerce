import { Body, Controller, Post } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CreateOrderDto } from './dtos';
import { OrdersService } from './orders.service';

@UseAuthGuard()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@CurrentUser() currentUser: User, @Body() orderData: CreateOrderDto): Promise<{ message: string }> {
    await this.ordersService.checkout(currentUser, orderData);
    return { message: 'successful' };
  }
}
