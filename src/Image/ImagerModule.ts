import { Module } from '@nestjs/common';
import { ImagerController } from './ImagerController';
import { ImagerService } from './ImagerService';

@Module({
  imports: [],
  controllers: [ImagerController],
  providers: [ImagerService],
  exports: [ImagerService],
})
export class ImagerModule {}
