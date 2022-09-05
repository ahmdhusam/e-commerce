import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
