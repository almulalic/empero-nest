import { ResponseGrid } from '../../Common';
import { Order } from '../../Models/Entities';
import { OrdersService } from '../../Services/index';
import { OrderDTO } from '../../Services/Orders/DTO';
import { GridParams } from '../../Common/ResponseGrid';
import { GetOrderDTO } from '../../Services/Orders/DTO';
import { Controller, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  public async GetAllProducts(@Body() body: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetAllOrders(body);
  }

  @Post('/archive')
  @HttpCode(HttpStatus.OK)
  public async GetArchive(@Body() body: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetArchive(body);
  }

  @Post('/:orderId')
  public async GetOrder(@Body() body: GetOrderDTO, @Param('orderId') productId: number): Promise<Order> {
    return await this.OrdersService.GetOrder(body, productId);
  }

  @Post()
  public async AddOrder(@Body() body: OrderDTO): Promise<string> {
    return await this.OrdersService.AddOrder(body, 1);
  }

  @Put('/:orderId')
  public async ModifyOrder(@Param('orderId') orderId: number, @Body() body: OrderDTO): Promise<string> {
    return await this.OrdersService.ModifyOrder(orderId, body, 1);
  }

  @Delete('/:productId')
  public async DeleteProduct(@Param('productId') productId: number): Promise<string> {
    return await this.OrdersService.RemoveOrder(productId);
  }
}
