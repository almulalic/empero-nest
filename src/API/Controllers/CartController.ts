import { Cart } from '../../Models/Entities';
import { CartService } from '../../Services';
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
  public async AddToCart(@Body() dto: AddToCartDTO): Promise<string> {
    return await this.CartService.AddToCart(dto, 1);
  }

  @Delete(':id')
  public async RemoveFromCart(@Param('id') cartId: number): Promise<string> {
    return await this.CartService.RemoveFromCart(cartId, 1);
  }
}
