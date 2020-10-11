import { Module } from '@nestjs/common';
import { DbModule, CartModule, ProductModule, OrderModule, CustomerModule } from './';

@Module({
  imports: [DbModule, CartModule, ProductModule, OrderModule, CustomerModule],
})
export class AppModule {}
