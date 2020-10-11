import { Module } from '@nestjs/common';
import { CustomerService } from '../../Services';
import { CustomerController } from '../Controllers';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
