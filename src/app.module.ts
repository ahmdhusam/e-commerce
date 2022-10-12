import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Orders } from './orders/orders.entity';
import { Cart } from './cart/cart.entity';
import { User } from './users/users.entity';
import { Product } from './products/products.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { StripeModule } from 'nestjs-stripe';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: config.getOrThrow('DB_PORT'),
        username: config.getOrThrow('DB_USERNAME'),
        password: config.getOrThrow('DB_PASSWORD'),
        database: config.getOrThrow('DB_NAME'),
        entities: [User, Product, Cart, Orders],
        synchronize: config.getOrThrow('NODE_ENV') !== 'production',
      }),
    }),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('STRIPE_SECRET_KEY'),
        apiVersion: '2022-08-01',
      }),
    }),
    RouterModule.register([
      { path: 'api/v1', children: [AuthModule, UsersModule, ProductsModule, CartModule, OrdersModule] },
    ]),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        { rootPath: join(process.cwd(), ...config.getOrThrow<string>('SERVE_STATIC_PATH').split('/')) },
      ],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
