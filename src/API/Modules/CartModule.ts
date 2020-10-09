import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../Models/Entities';
import CartService from '../../Services/Cart/CartService';
import { CartController } from '../Controllers';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
