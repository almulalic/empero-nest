import { ResponseGrid } from '../../Common';
import { Order } from '../../Models/Entities/Order';
import { GetOrderDTO, OrderDTO } from '../Orders/DTO';
import { GridParams } from '../../Common/ResponseGrid';

export interface IOrderService {
  GetAllOrders(dto: GridParams): Promise<ResponseGrid<Order>>;
  GetArchive(dto: GridParams): Promise<ResponseGrid<Order>>;
  GetOrder(dto: GetOrderDTO, orderId: number): Promise<Order>;
  OrderCart(currentCustomerId: number): Promise<string>;
  AddOrder(dto: OrderDTO, customerId: number): Promise<string>;
  ModifyOrder(orderId: number, dto: OrderDTO, customerId: number): Promise<string>;
  RemoveOrder(orderId: number): Promise<string>;
}
