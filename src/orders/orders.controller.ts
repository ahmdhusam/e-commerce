import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UseAuthGuard } from 'src/auth/guards';
import { MessageSerializeDto, ResponseMessage } from 'src/dtos';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CreateOrderDto, OrderSerializeDto } from './dtos';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseSerialize(MessageSerializeDto)
@UseAuthGuard()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOkResponse({ description: 'The record has been successfully created', type: () => MessageSerializeDto })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @Post('checkout')
  async checkout(@CurrentUser() currentUser: User, @Body() orderData: CreateOrderDto): Promise<MessageSerializeDto> {
    await this.ordersService.checkout(currentUser, orderData);
    return { message: ResponseMessage.Successful };
  }

  @ApiOkResponse({ isArray: true, type: () => OrderSerializeDto })
  @UseSerialize(OrderSerializeDto)
  @Get()
  getOrders(@CurrentUser() currentUser: User): Promise<Orders[]> {
    return this.ordersService.getOrders(currentUser);
  }

  @ApiOkResponse({ description: 'The record has been successfully deleted', type: () => MessageSerializeDto })
  @ApiNotFoundResponse({ description: 'Order Not Found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Delete(':orderId')
  async deleteOrder(
    @CurrentUser() currentUser: User,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<MessageSerializeDto> {
    await this.ordersService.deleteOneById(currentUser, orderId);
    return { message: ResponseMessage.Successful };
  }
}
