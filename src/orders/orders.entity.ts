import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/users/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment: string;

  @Column({ type: 'numeric' })
  total: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  owner: User;

  @OneToMany(() => Cart, cart => cart.order)
  cart: Cart[];
}
