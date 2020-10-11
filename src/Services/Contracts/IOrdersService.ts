import { ResponseGrid } from '../../Common';
import { Order } from '../../Models/Entities/Order';
import { GetOrderDTO, PlaceOrderDTO } from '../Orders/DTO';
import { GridParams } from '../../Common/ResponseGrid/ResponseGrid';

export interface IOrderService {
  GetAllOrders(dto: GridParams): Promise<ResponseGrid<Order>>;
  GetArchive(dto: GridParams): Promise<ResponseGrid<Order>>;
  GetOrder(dto: GetOrderDTO, orderId: number): Promise<Order>;
  PlaceOrder(dto: PlaceOrderDTO, customerId: number): Promise<string>;
  OrderCart(currentCustomerId: number): Promise<string>;
  RemoveOrder(orderId: number): Promise<string>;
}
