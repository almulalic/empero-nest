import { Module } from '@nestjs/common';
import {
  DbModule,
  CartModule,
  ProductModule,
  OrderModule,
  IdentityModule,
  CategoryModule,
  TokenLogModule,
} from './Modules';
import { ImagerModule } from '../Microservices/Image/ImagerModule';

@Module({
  imports: [
    DbModule,
    CartModule,
    ProductModule,
    OrderModule,
    IdentityModule,
    CategoryModule,
    TokenLogModule,
    ImagerModule,
  ],

  exports: [TokenLogModule],
})
export class AppModule {}
