import { Cart } from 'src/cart/cart.entity';
import { Orders } from '../orders.entity';

export interface IOrders extends Orders {
  products: Cart[];
}
