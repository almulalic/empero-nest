import { Module } from '@nestjs/common';
import { IdentityService } from '../../Services';
import { IdentityController } from '../Controllers';

@Module({
  imports: [],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
