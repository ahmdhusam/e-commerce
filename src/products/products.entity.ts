import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Category {}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 101 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'real', unsigned: true })
  price: number;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'smallint', unsigned: true })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE', nullable: false })
  author: User;

  @OneToMany(() => Cart, cart => cart.product)
  carts: Cart[];
}
