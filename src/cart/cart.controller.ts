import { BadRequestException, Controller, Get, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { isPositive } from 'class-validator';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { ProductSerialize } from 'src/products/dtos';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CartService } from './cart.service';
import { CartOptionsDto } from './dtos';

@UseAuthGuard()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('add')
  async addToCart(
    @CurrentUser() currentUser: User,
    @Query('product-id', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<{ message: string }> {
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    await this.cartService.add(currentUser, productId, quantity);
    return { message: 'success' };
  }

  @UseSerialize(ProductSerialize)
  @Get()
  getCart(
    @CurrentUser() currentUser: User,
    @Query() { limit = 10, skip = 0 }: CartOptionsDto,
  ): Promise<ProductSerialize[]> {
    return this.cartService.cart(currentUser, limit, skip);
  }
}
