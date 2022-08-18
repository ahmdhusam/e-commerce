import { User } from 'src/users/users.entity';
import { Product } from 'src/products/products.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Cart extends BaseEntity {
  @Column()
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @PrimaryColumn({ name: 'ownerId' })
  @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  owner: User;

  @PrimaryColumn({ name: 'productId' })
  @ManyToOne(() => Product, product => product.carts, { onDelete: 'CASCADE' })
  product: Product;
}
