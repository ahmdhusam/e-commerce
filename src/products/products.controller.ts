import { Body, Controller, Delete, Param, Post, Put, Get } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { UseSerialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users/users.entity';
import { ProductDataDto, ProductSerializeDto } from './dtos';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@UseSerialize(ProductSerializeDto)
@UseAuthGuard()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create-product')
  createProduct(@CurrentUser() currentUser: User, @Body() productData: ProductDataDto): Promise<ProductSerializeDto> {
    return this.productsService.create(currentUser, productData);
  }

  @Put('update-product')
  updateProduct(
    @CurrentUser() currentUser: User,
    @Body() { id, ...productData }: UpdateProductDto,
  ): Promise<ProductSerializeDto> {
    return this.productsService.update(currentUser, id, productData);
  }

  @Delete('delete-product/:productId')
  deleteProduct(@CurrentUser() currentUser: User, @Param('productId') productId: string): Promise<ProductSerializeDto> {
    return this.productsService.delete(currentUser, productId);
  }

  @Get(':productId')
  getProduct(@Param('productId') productId: string): Promise<ProductSerializeDto> {
    return this.productsService.getOneById(productId);
  }
}
