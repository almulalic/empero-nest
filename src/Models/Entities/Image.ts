import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { ProductImage } from './ProductImage';

@Entity('image', { schema: 'empero' })
export class Image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('mediumblob', { name: 'image' })
  image: Buffer;

  @Column('int', { name: 'type' })
  type: number;

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

  @OneToMany(() => Product, (product) => product.primaryImage)
  products: Product[];

  @OneToMany(() => ProductImage, (productimage) => productimage.image)
  productimages: ProductImage[];
}
