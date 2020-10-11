import { DateTime } from 'luxon';
import { ResponseGrid } from '../../Common';
import { IOrderService } from './../Contracts';
import { GetOrderDTO, PlaceOrderDTO } from './DTO';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Customer, Order, Product } from '../../Models/Entities';
import { GridParams } from '../../Common/ResponseGrid/ResponseGrid';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as responseMessages from '../../../responseMessages.config.json';

@Injectable()
export class OrdersService implements IOrderService {
  private ordersScope: SelectQueryBuilder<Order>;

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    this.ordersScope = this.entityManager
      .getRepository(Order)
      .createQueryBuilder()
      .innerJoinAndSelect('Order.customer', 'Customer')
      .innerJoinAndSelect('Order.product', 'Product');
  }

  public GetAllOrders = async (dto: GridParams): Promise<ResponseGrid<Order>> => {
    let orders: Order[] = await this.ordersScope.where('Order.archivedAt IS NULL').getMany();

    return new ResponseGrid(orders).GetGridData(dto);
  };

  public GetArchive = async (dto: GridParams): Promise<ResponseGrid<Order>> => {
    let archive: Order[] = await this.ordersScope.where('Order.archivedAt IS NOT NULL').getMany();

    return new ResponseGrid(archive).GetGridData(dto);
  };

  public GetOrder = async (dto: GetOrderDTO, orderId: number): Promise<Order> => {
    let order: Order = await this.entityManager.getRepository(Order).findOne({ id: orderId });

    if (!order) throw new HttpException(responseMessages.order.getOne.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (!dto.includeArchived && order.archivedAt !== null)
      throw new HttpException(responseMessages.order.getOne.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (!dto.includeArchived && order.archivedAt !== null)
      throw new HttpException(responseMessages.order.getOne.alreadyArchivedOrder, HttpStatus.NOT_FOUND);

    return order;
  };

  public PlaceOrder = async (dto: PlaceOrderDTO, currentCustomerId: number): Promise<string> => {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ id: currentCustomerId });

    if (!customer) throw new HttpException(responseMessages.order.add.nonExistingCustomer, HttpStatus.NOT_FOUND);

    let product: Product = await this.entityManager.getRepository(Product).findOne({ id: dto.productId });

    if (!product) throw new HttpException(responseMessages.order.add.nonExistingCustomer, HttpStatus.NOT_FOUND);

    dto.customerId = currentCustomerId;
    dto.totalPrice = product.price * dto.quantity;

    await this.entityManager.getRepository(Product).insert(dto);

    return responseMessages.product.add.success;
  };

  public OrderCart = async (currentCustomerId: number): Promise<string> => {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ id: currentCustomerId });

    throw new Error('Method not implemented');
  };

  public RemoveOrder = async (orderId: number): Promise<string> => {
    let order: Order = await this.entityManager.getRepository(Order).findOne({ id: orderId });

    if (!order) throw new HttpException(responseMessages.order.remove.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (order.archivedAt !== null)
      throw new HttpException(responseMessages.order.remove.alreadyArchivedOrder, HttpStatus.NOT_FOUND);

    await this.entityManager.getRepository(Order).update(order.id, { archivedAt: DateTime.utc().toSQL() });

    return responseMessages.product.remove.success;
  };
}
