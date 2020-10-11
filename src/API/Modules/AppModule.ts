import { Module } from '@nestjs/common';
import { DbModule, CartModule, ProductModule, OrderModule } from './';

@Module({
  imports: [DbModule, CartModule, ProductModule, OrderModule],
})
export class AppModule {}
