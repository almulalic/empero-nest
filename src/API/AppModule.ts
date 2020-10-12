import { Module } from '@nestjs/common';
import { DbModule, CartModule, ProductModule, OrderModule, IdentityModule } from './Modules';

@Module({
  imports: [DbModule, CartModule, ProductModule, OrderModule, IdentityModule],
})
export class AppModule {}
