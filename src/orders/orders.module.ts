import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersController } from './orders.controller';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';
import { PaymentsService } from './services/payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), ProductsModule, CartModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentsService],
})
export class OrdersModule {}
