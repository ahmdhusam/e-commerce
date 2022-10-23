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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { UseAuthGuard } from 'src/auth/guards';
import { MessageSerializeDto, ResponseMessage } from 'src/dtos';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { ProductSerializeDto } from 'src/products/dtos';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { CartService } from './cart.service';
import { CartOptionsDto } from './dtos';

@ApiTags('cart')
@ApiBearerAuth()
@UseSerialize(MessageSerializeDto)
@UseAuthGuard()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOkResponse({
    description: 'The quantity of product has been successfully added',
    type: () => MessageSerializeDto,
  })
  @ApiNotFoundResponse({ description: 'Product Not Found' })
  @ApiBadRequestResponse({ description: 'the quantity should be smaller than the quantity of the product' })
  @ApiParam({ name: 'productId', type: 'UUIDv4' })
  @Get('add/:productId')
  async addToCart(
    @CurrentUser() currentUser: User,
    @Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<MessageSerializeDto> {
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    await this.cartService.add(currentUser.id, productId, quantity);
    return { message: ResponseMessage.Successful };
  }

  @ApiOkResponse({
    description: 'The quantity of product has been successfully reversed',
    type: () => MessageSerializeDto,
  })
  @ApiNotFoundResponse({ description: 'Product Not Found' })
  @ApiParam({ name: 'productId', type: 'UUIDv4' })
  @Get('reverse/:productId')
  async reverseFromCart(
    @CurrentUser() currentUser: User,
    @Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<MessageSerializeDto> {
    if (!isPositive(quantity)) throw new BadRequestException('quantity must be a positive number');

    await this.cartService.reverse(currentUser.id, productId, quantity);
    return { message: ResponseMessage.Successful };
  }

  @ApiOkResponse({ isArray: true, type: () => ProductSerializeDto })
  @UseSerialize(ProductSerializeDto)
  @Get()
  getCart(
    @CurrentUser() currentUser: User,
    @Query() { limit = 10, skip = 0 }: CartOptionsDto,
  ): Promise<ProductSerializeDto[]> {
    return this.cartService.cart(currentUser.id, Math.min(limit, 30), skip);
  }

  @ApiOkResponse({
    description: 'The product has been successfully deleted from cart',
    type: () => MessageSerializeDto,
  })
  @ApiParam({ name: 'productId', type: 'UUIDv4' })
  @Delete(':productId')
  async delete(
    @CurrentUser() currentUser: User,
    @Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string,
  ): Promise<MessageSerializeDto> {
    await this.cartService.delete(currentUser.id, productId);

    return { message: ResponseMessage.Successful };
  }
}
