import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './Image';
import { Product } from './Product';

@Index('productimage_image_id_fk', ['imageId'], {})
@Index('productimage_product_id_fk', ['productId'], {})
@Entity('productimage', { schema: 'empero' })
export class ProductImage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'productId' })
  productId: number;

  @Column('int', { name: 'imageId' })
  imageId: number;

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

  @ManyToOne(() => Image, (image) => image.productimages, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'imageId', referencedColumnName: 'id' }])
  image: Image;

  @ManyToOne(() => Product, (product) => product.productimages, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;
}
