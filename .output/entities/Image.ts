import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Productimage } from "./Productimage";
import { Product } from "./Product";

@Entity("image", { schema: "empero" })
export class Image {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("mediumblob", { name: "image" })
  image: Buffer;

  @Column("int", { name: "type" })
  type: number;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "modifiedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  modifiedAt: Date;

  @OneToMany(() => Productimage, (productimage) => productimage.image)
  productimages: Productimage[];

  @OneToMany(() => Product, (product) => product.primaryImage)
  products: Product[];
}
