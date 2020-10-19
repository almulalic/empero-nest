import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './Productimage';

@Entity('image', { schema: 'empero' })
export class Image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('mediumblob', { name: 'image' })
  image: Buffer;

  @Column('int', { name: 'type' })
  type: number;

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

  @Column('varchar', {
    name: 'encoding',
    nullable: true,
    length: 10,
    default: () => "'7bit'",
  })
  encoding: string | null;

  @Column('varchar', { name: 'mimetype', length: 10 })
  mimetype: string;

  @Column('int', { name: 'sizeInKB', default: () => "'0'" })
  sizeInKb: number;

  @OneToMany(() => ProductImage, (productimage) => productimage.image)
  productimages: ProductImage[];
}
