import { Controller, Get, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CartService } from './cart.service';

@UseAuthGuard()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('add')
  async addToCart(
    @CurrentUser() currentUser: User,
    @Query('product-id', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('qty', ParseIntPipe) qty: number,
  ): Promise<{ message: string }> {
    await this.cartService.add(currentUser, productId, qty);
    return { message: 'success' };
  }
}
