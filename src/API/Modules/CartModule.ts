import { Module } from '@nestjs/common';
import { CartService } from '../../Services';
import { CartController } from '../Controllers';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
