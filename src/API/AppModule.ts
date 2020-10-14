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

@Module({
  imports: [DbModule, CartModule, ProductModule, OrderModule, IdentityModule, CategoryModule, TokenLogModule],
  exports: [TokenLogModule],
})
export class AppModule {}
