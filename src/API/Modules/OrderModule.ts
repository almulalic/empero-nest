import { Module } from '@nestjs/common';
import { OrdersService } from '../../Services';
import { OrdersController } from './../Controllers';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrderModule {}
