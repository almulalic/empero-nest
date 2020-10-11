import { Order } from '../../../Models/Entities/Order';

export class OrderDTO extends Order {
  customerId: number;
  productId: number;
  quantity: number;
}
