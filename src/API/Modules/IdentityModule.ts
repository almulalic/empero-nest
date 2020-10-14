import { Module } from '@nestjs/common';
import { IdentityService } from '../../Services';
import { LocalStrategy } from '../Auth/LocalStrategy';
import { IdentityController } from '../Controllers';
import { TokenLogger } from './../../Common/TokenLogger';

@Module({
  imports: [],
  controllers: [IdentityController],
  providers: [IdentityService, TokenLogger, LocalStrategy],
  exports: [IdentityService],
})
export class IdentityModule {}
