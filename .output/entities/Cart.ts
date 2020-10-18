import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Customer } from "./Customer";

@Index("cart_product_id_fk", ["productId"], {})
@Index("cart_customer_id_fk", ["customerId"], {})
@Entity("cart", { schema: "empero" })
export class Cart {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "customerId" })
  customerId: number;

  @Column("int", { name: "productId" })
  productId: number;

  @Column("int", { name: "quantity", nullable: true, default: () => "'1'" })
  quantity: number | null;

  @Column("float", { name: "totalPrice", nullable: true, precision: 12 })
  totalPrice: number | null;

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

  @Column("datetime", { name: "archivedAt", nullable: true })
  archivedAt: Date | null;

  @ManyToOne(() => Product, (product) => product.carts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "productId", referencedColumnName: "id" }])
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.carts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customerId", referencedColumnName: "id" }])
  customer: Customer;
}
