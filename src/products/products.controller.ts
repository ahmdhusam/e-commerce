import { Body, Controller, Delete, Param, Post, Put, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SkipAuth, UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/shared/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { ProductDataDto, ProductSerializeDto, ProductsOptionsDto } from './dtos';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@UseSerialize(ProductSerializeDto)
@UseAuthGuard()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOkResponse()
  @SkipAuth()
  @Get()
  getProducts(@Query() { limit = 20, skip = 0 }: ProductsOptionsDto): Promise<ProductSerializeDto[]> {
    return this.productsService.getProducts(Math.min(limit, 30), skip);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The record has been successfully created', type: () => ProductSerializeDto })
  @Post('create-product')
  createProduct(@CurrentUser() currentUser: User, @Body() productData: ProductDataDto): Promise<ProductSerializeDto> {
    return this.productsService.create(currentUser, productData);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The record has been successfully updated', type: () => ProductSerializeDto })
  @ApiNotFoundResponse({ description: 'Product Not Found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Put('update-product')
  updateProduct(
    @CurrentUser() currentUser: User,
    @Body() { id, ...productData }: UpdateProductDto,
  ): Promise<ProductSerializeDto> {
    return this.productsService.update(currentUser, id, productData);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The record has been successfully deleted', type: () => ProductSerializeDto })
  @ApiNotFoundResponse({ description: 'Product Not Found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiParam({ name: 'productId', type: 'UUIDv4' })
  @Delete('delete-product/:productId')
  deleteProduct(
    @CurrentUser() currentUser: User,
    @Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string,
  ): Promise<ProductSerializeDto> {
    return this.productsService.delete(currentUser, productId);
  }

  @ApiOkResponse({ type: () => ProductSerializeDto })
  @ApiNotFoundResponse({ description: 'Product Not Found.' })
  @ApiParam({ name: 'productId', type: 'UUIDv4' })
  @SkipAuth()
  @Get(':productId')
  getProduct(@Param('productId', new ParseUUIDPipe({ version: '4' })) productId: string): Promise<ProductSerializeDto> {
    return this.productsService.getOneById(productId);
  }
}
