import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './Customer';
import { Product } from './Product';

@Index('cart_customer_id_fk', ['customerId'], {})
@Index('cart_product_id_fk', ['productId'], {})
@Entity('cart', { schema: 'empero' })
export class Cart {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'customerId' })
  customerId: number;

  @Column('int', { name: 'productId' })
  productId: number;

  @Column('int', { name: 'quantity', nullable: true, default: () => "'1'" })
  quantity: number | null;

  @Column('float', { name: 'totalPrice', nullable: true, precision: 12 })
  totalPrice: number | null;

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

  @Column('datetime', { name: 'archivedAt', nullable: true, select: false })
  archivedAt: Date | null;

  @ManyToOne(() => Customer, (customer) => customer.carts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.carts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
