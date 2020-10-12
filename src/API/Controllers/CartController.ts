import { Cart } from '../../Models/Entities';
import { CartService } from '../../Services';
import { Ok, OkResponse } from '../../Common';
import { AddToCartDTO } from '../../Services/Cart/DTO';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Get()
  public async FindAll(): Promise<Cart[]> {
    return await this.CartService.GetCartItems(1);
  }

  @Post()
  public async AddToCart(@Body() body: AddToCartDTO): Promise<OkResponse> {
    return Ok(await this.CartService.AddToCart(body, 1));
  }

  @Delete(':id')
  public async RemoveFromCart(@Param('id') cartId: number): Promise<OkResponse> {
    return Ok(await this.CartService.RemoveFromCart(cartId, 1));
  }
}
