import { Cart } from '../../Models/Entities';
import { CartService } from '../../Services';
import { Ok, OkResponse } from '../../Common';
import { AddToCartDTO } from '../../Services/Cart/DTO';
import { AuthenticationInterceptor } from '../Auth/AuthenticationInterceptor';
import { Body, Controller, Delete, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';

@Controller('cart')
@UseInterceptors(AuthenticationInterceptor)
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Get()
  public async FindAll(@Req() req): Promise<Cart[]> {
    return await this.CartService.GetCartItems(req.currentCustomer.id);
  }

  @Post()
  public async AddToCart(@Body() body: AddToCartDTO, @Req() req): Promise<OkResponse> {
    return Ok(await this.CartService.AddToCart(body, req.currentCustomer.id));
  }

  @Delete(':id')
  public async RemoveFromCart(@Param('id') cartId: number, @Req() req): Promise<OkResponse> {
    return Ok(await this.CartService.RemoveFromCart(cartId, req.currentCustomer.id));
  }
}
