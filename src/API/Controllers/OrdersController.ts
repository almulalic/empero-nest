import { ResponseGrid } from '../../Common';
import { Order } from '../../Models/Entities';
import { OrdersService } from '../../Services/index';
import { OrderDTO } from '../../Services/Orders/DTO';
import { GetOrderDTO } from '../../Services/Orders/DTO';
import { GridParams, Ok, OkResponse } from '../../Common/ResponseFormatter';
import { Controller, Post, Body, Delete, Param, Put, HttpCode, HttpStatus, UseInterceptors, Req } from '@nestjs/common';
import { AuthorizationInterceptor } from '../Auth/AuthorizationInterceptor';
import { AuthenticationInterceptor } from '../Auth/AuthenticationInterceptor';

@Controller('orders')
@UseInterceptors(AuthenticationInterceptor)
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthorizationInterceptor)
  public async GetAllProducts(@Body() body: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetAllOrders(body);
  }

  @Post('/archive')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthorizationInterceptor)
  public async GetArchive(@Body() body: GridParams): Promise<ResponseGrid<Order>> {
    return await this.OrdersService.GetArchive(body);
  }

  @Post('/:orderId')
  @UseInterceptors(AuthorizationInterceptor)
  public async GetOrder(@Body() body: GetOrderDTO, @Param('orderId') productId: number): Promise<Order> {
    return await this.OrdersService.GetOrder(body, productId);
  }

  @Post()
  public async AddOrder(@Body() body: OrderDTO, @Req() @Req() req): Promise<OkResponse> {
    return Ok(await this.OrdersService.AddOrder(body, req.currentCustomer.id));
  }

  @Put('/:orderId')
  public async ModifyOrder(@Param('orderId') orderId: number, @Body() body: OrderDTO, @Req() req): Promise<OkResponse> {
    return Ok(await this.OrdersService.ModifyOrder(orderId, body, req.currentCustomer.id));
  }

  @Delete('/:orderId')
  public async RemoveOrder(@Param('orderId') orderId: number): Promise<OkResponse> {
    return Ok(await this.OrdersService.RemoveOrder(orderId));
  }
}
