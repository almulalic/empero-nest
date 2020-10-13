import { Module } from '@nestjs/common';
import { TokenLogger } from '../../Common/TokenLogger';

@Module({
  controllers: [],
  providers: [TokenLogger],
  exports: [TokenLogger],
})
export class TokenLogModule {}
