import { ResponseGrid } from '../../Common';
import { Order, Product } from '../../Models/Entities';
import { OrdersService } from '../../Services/index';
import { ProductDTO } from '../../Services/Products/DTO';
import { GridParams } from './../../Common/ResponseGrid/ResponseGrid';
import { Controller, Get, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { GetOrderDTO } from '../../Services/Orders/DTO';
import { PlaceOrderDTO } from './../../Services/Orders/DTO/PlaceOrderDTO';

@Controller('orders')
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  public async GetAllProducts(@Body() dto: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetAllOrders(dto);
  }

  @Post('/archive')
  @HttpCode(HttpStatus.OK)
  public async GetArchive(@Body() dto: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetArchive(dto);
  }

  @Post('/:orderId')
  public async GetOrder(@Body() dto: GetOrderDTO, @Param('orderId') productId: number): Promise<Order> {
    return await this.OrdersService.GetOrder(dto, productId);
  }

  @Post()
  public async PlaceOrder(@Body() dto: PlaceOrderDTO): Promise<string> {
    return await this.OrdersService.PlaceOrder(dto, 1);
  }

  //   @Put('/:orderId')
  //   public async UpdateProduct(@Param('productId') productId: number, @Body() dto: PlaceOrderDTO): Promise<string> {
  //     // return await this.OrdersService.UpdateProduct(productId, dto, 1);
  //   }

  @Delete('/:productId')
  public async DeleteProduct(@Param('productId') productId: number): Promise<string> {
    return await this.OrdersService.RemoveOrder(productId);
  }
}
