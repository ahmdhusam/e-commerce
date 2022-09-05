import { Controller } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards';
import { OrdersService } from './orders.service';

@UseAuthGuard()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
}
