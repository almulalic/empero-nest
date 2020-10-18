import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './Cart';
import { Order } from './Order';
import { Image } from './Image';
import { ProductImage } from './ProductImage';
import { Category } from './Category';

@Index('product_image_id_fk', ['primaryImageId'], {})
@Index('product_category_id_fk', ['categoryId'], {})
@Entity('product', { schema: 'empero' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'heading', length: 100 })
  heading: string;

  @Column('text', { name: 'subheading', nullable: true })
  subheading: string | null;

  @Column('int', { name: 'categoryId' })
  categoryId: number;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('text', { name: 'fullDescription' })
  fullDescription: string;

  @Column('int', { name: 'primaryImageId', nullable: true })
  primaryImageId: number | null;

  @Column('float', { name: 'price', precision: 12 })
  price: number;

  @Column('float', { name: 'secondPrice', nullable: true, precision: 12 })
  secondPrice: number | null;

  @Column('tinyint', { name: 'isRecommended', default: () => "'0'" })
  isRecommended: number;

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

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @ManyToOne(() => Image, (image) => image.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'primaryImageId', referencedColumnName: 'id' }])
  primaryImage: Image;

  @OneToMany(() => ProductImage, (ProductImage) => ProductImage.product)
  productimages: ProductImage[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category: Category;
}
