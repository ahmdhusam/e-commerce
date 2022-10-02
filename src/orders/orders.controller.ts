import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { ResponseMessage } from 'src/types';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CreateOrderDto, OrderSerializeDto } from './dtos';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';

@UseAuthGuard()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@CurrentUser() currentUser: User, @Body() orderData: CreateOrderDto): Promise<ResponseMessage> {
    await this.ordersService.checkout(currentUser, orderData);
    return { message: 'successful' };
  }

  @UseSerialize(OrderSerializeDto)
  @Get()
  getOrders(@CurrentUser() currentUser: User): Promise<Orders[]> {
    return this.ordersService.getOrders(currentUser);
  }

  @Delete(':orderId')
  async deleteOrder(
    @CurrentUser() currentUser: User,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<ResponseMessage> {
    await this.ordersService.deleteById(currentUser, orderId);
    return { message: 'successful' };
  }
}
