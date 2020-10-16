import { Module } from '@nestjs/common';
import { ProductsService } from '../../Services';
import { ProductsController } from '../Controllers';
import { ImagerModule } from './../../Image/ImagerModule';

@Module({
  imports: [ImagerModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductModule {}
