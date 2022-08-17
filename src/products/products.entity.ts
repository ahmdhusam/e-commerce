import { User } from 'src/users/users.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum Category {}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ enum: Category })
  category: Category;

  @Column({ type: 'smallint' })
  quantity: number;

  @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE' })
  author: User;
}
