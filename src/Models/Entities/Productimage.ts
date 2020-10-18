import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Index('productimage_product_id_fk', ['productId'], {})
@Index('productimage_image_id_fk', ['imageId'], {})
@Entity('productimage', { schema: 'empero' })
export class ProductImage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'productId' })
  productId: number;

  @Column('int', { name: 'imageId' })
  imageId: number;

  @Column('timestamp', {
    name: 'modifiedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  modifiedAt: Date;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', { name: 'archivedAt', nullable: true })
  archivedAt: Date | null;

  @ManyToOne(() => Product, (product) => product.productimages, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Product;

  @ManyToOne(() => Image, (image) => image.productimages, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'imageId', referencedColumnName: 'id' }])
  image: Image;
}
