import { DateTime } from 'luxon';
import { ResponseGrid } from '../../Common';
import { IOrderService } from './../Contracts';
import { GetOrderDTO, OrderDTO } from './DTO';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GridParams } from '../../Common/ResponseFormatter';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Customer, Order, Product } from '../../Models/Entities';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as responseMessages from '../../../responseMessages.config.json';

@Injectable()
export class OrdersService implements IOrderService {
  private ordersScope: SelectQueryBuilder<Order>;

  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {
    this.ordersScope = this.EntityManager.getRepository(Order)
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
    let order: Order = await this.EntityManager.getRepository(Order).findOne({ id: orderId });

    if (!order) throw new HttpException(responseMessages.order.getOne.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (!dto.includeArchived && order.archivedAt !== null)
      throw new HttpException(responseMessages.order.getOne.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (!dto.includeArchived && order.archivedAt !== null)
      throw new HttpException(responseMessages.order.getOne.alreadyArchivedOrder, HttpStatus.NOT_FOUND);

    return order;
  };

  public OrderCart = async (currentCustomerId: number): Promise<string> => {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ id: currentCustomerId });

    throw new Error('Method not implemented');
  };

  public AddOrder = async (dto: OrderDTO, currentCustomerId: number): Promise<string> => {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ id: currentCustomerId });
    if (!customer) throw new HttpException(responseMessages.order.add.nonExistingCustomer, HttpStatus.NOT_FOUND);

    let product: Product = await this.EntityManager.getRepository(Product).findOne({ id: dto.productId });
    if (!product) throw new HttpException(responseMessages.order.add.nonExistingCustomer, HttpStatus.NOT_FOUND);

    dto.customerId = currentCustomerId;
    dto.totalPrice = product.price * dto.quantity;

    await this.EntityManager.getRepository(Product).insert(dto);

    return responseMessages.product.add.success;
  };

  public ModifyOrder = async (orderId: number, dto: OrderDTO, currentCustomerId: number): Promise<string> => {
    let order: Order = await this.EntityManager.getRepository(Order).findOne({ id: orderId });
    if (!order) throw new HttpException(responseMessages.order.modify.nonExistingProduct, HttpStatus.NOT_FOUND);

    let modifiedOrder: Order = dto;
    modifiedOrder.id = order.id;
    modifiedOrder.createdAt = order.createdAt;
    modifiedOrder.archivedAt = order.archivedAt;

    await this.EntityManager.getRepository(Product).save(modifiedOrder);

    return responseMessages.order.modify.success;
  };

  public RemoveOrder = async (orderId: number): Promise<string> => {
    let order: Order = await this.EntityManager.getRepository(Order).findOne({ id: orderId });

    if (!order) throw new HttpException(responseMessages.order.remove.nonExistingOrder, HttpStatus.NOT_FOUND);
    else if (order.archivedAt !== null)
      throw new HttpException(responseMessages.order.remove.alreadyArchivedOrder, HttpStatus.NOT_FOUND);

    await this.EntityManager.getRepository(Order).update(order.id, { archivedAt: DateTime.utc().toSQL() });

    return responseMessages.product.remove.success;
  };
}
