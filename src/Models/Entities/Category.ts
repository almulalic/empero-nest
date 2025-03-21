import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';

@Entity('category', { schema: 'empero' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'categoryName', length: 50 })
  categoryName: string;

  @Column('timestamp', {
    name: 'createdAt',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'modifiedAt',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  modifiedAt: Date;

  @Column('datetime', { name: 'archivedAt', select: false, nullable: true })
  archivedAt: Date | null;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
