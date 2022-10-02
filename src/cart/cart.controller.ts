import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { isPositive } from 'class-validator';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { ProductSerializeDto } from 'src/products/dtos';
import { ResponseMessage } from 'src/types';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CartService } from './cart.service';
import { CartOptionsDto } from './dtos';

@UseAuthGuard()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('add/:id')
  async addToCart(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<ResponseMessage> {
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    await this.cartService.add(currentUser, productId, quantity);
    return { message: 'successful' };
  }

  @Get('reverse/:id')
  async reverseFromCart(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<ResponseMessage> {
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    await this.cartService.reverse(currentUser.id, productId, quantity);
    return { message: 'successful' };
  }

  @UseSerialize(ProductSerializeDto)
  @Get()
  getCart(
    @CurrentUser() currentUser: User,
    @Query() { limit = 10, skip = 0 }: CartOptionsDto,
  ): Promise<ProductSerializeDto[]> {
    return this.cartService.cart(currentUser, Math.min(limit, 30), skip);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) productId: string,
  ): Promise<ResponseMessage> {
    await this.cartService.delete(currentUser.id, productId);

    return { message: 'successful' };
  }
}
