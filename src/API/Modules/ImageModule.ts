import { Module } from '@nestjs/common';
import { ImageController } from '../../Image/ImageController';
import { ImageService } from '../../Image/ImageService';

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModel {}
