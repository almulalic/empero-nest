import { Module } from '@nestjs/common';
import { DbModule, CartModule, ProductModule, OrderModule, IdentityModule, CategoryModule } from './Modules';

@Module({
  imports: [DbModule, CartModule, ProductModule, OrderModule, IdentityModule, CategoryModule],
})
export class AppModule {}
