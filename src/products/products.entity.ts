import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
