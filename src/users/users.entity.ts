import { Cart } from 'src/cart/cart.entity';
import { Orders } from 'src/orders/orders.entity';
import { Product } from 'src/products/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Check,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Check(`
    "birth_date"
    BETWEEN
    (CURRENT_DATE - INTERVAL '100 YEAR')
    AND 
    (CURRENT_DATE - INTERVAL '18 YEAR') 
  `)
  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ length: 141, default: '' })
  about: string;

  @Check(`"lat" BETWEEN -90 AND 90`)
  @Column({ type: 'real', nullable: true })
  lat: number;

  @Check(`"lng" BETWEEN -180 AND 180`)
  @Column({ type: 'real', nullable: true })
  lng: number;

  @Column({ length: 61 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User, user => user.followers, { onDelete: 'CASCADE' })
  @JoinTable({ joinColumn: { name: 'follower_id' }, inverseJoinColumn: { name: 'following_id' } })
  followings: User[];

  @ManyToMany(() => User, user => user.followings, { onDelete: 'CASCADE' })
  followers: User[];

  @OneToMany(() => Product, product => product.author)
  products: Product[];

  @OneToMany(() => Cart, cart => cart.owner)
  cart: Cart[];

  @OneToMany(() => Orders, orders => orders.owner)
  orders: Orders[];
}
