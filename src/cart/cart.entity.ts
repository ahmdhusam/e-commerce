import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';
import { Orders } from 'src/orders/orders.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryColumn({ name: 'owner_id' })
  ownerId: string;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Check('quantity > 0')
  @Column()
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Product, product => product.carts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Orders, orders => orders.cart, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Orders;
}
