import { Module } from '@nestjs/common';
import { IdentityService } from '../../Services';
import { IdentityController } from '../Controllers';
import { TokenLogger } from './../../Common/TokenLogger';

@Module({
  imports: [],
  controllers: [IdentityController],
  providers: [IdentityService, TokenLogger],
})
export class IdentityModule {}
