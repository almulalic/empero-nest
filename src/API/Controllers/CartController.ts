import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Cart } from '../../Models/Entities';
import CartService from '../../Services/Cart/CartService';
import { AddToCartDTO } from '../../Services/Cart/DTO';

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Get()
  public async FindAll(): Promise<Cart[]> {
    return await this.CartService.GetCartContent(1);
  }

  @Post()
  public async AddToCart(@Body() dto: AddToCartDTO): Promise<string> {
    return await this.CartService.AddToCart(dto, 1);
  }
}
