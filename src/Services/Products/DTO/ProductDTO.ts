import { Product } from '../../../Models/Entities';

export class ProductDTO extends Product {
  heading: string;
  subheading: string;
  categoryId: number;
  primaryImageId: number;
  description: string;
  fullDescription: string;
  price: number;
  secondPrice: number;
}
