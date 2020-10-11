import { Module } from '@nestjs/common';
import { ProductsService } from '../../Services';
import { ProductsController } from '../Controllers';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductModule {}
