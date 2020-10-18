import { EntityManager } from 'typeorm';
import { Image } from '../../Models/Entities';
import { Injectable } from '@nestjs/common';
import { ImageType } from '../../Common/Enumerations';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class ImagerService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {}

  public async UploadImage(image: any): Promise<number> {
    return (
      await this.EntityManager.getRepository(Image).insert({
        image: image.buffer,
        type: ImageType.Generic,
        mimetype: image.mimetype,
        encoding: image.encoding,
        sizeInKb: image.size,
      })
    ).generatedMaps[0].id;
  }

  public async UploadProductImage(buffer: Buffer, ProductImage: number): Promise<number> {
    // return (
    //   await this.EntityManager.getRepository(ProductImage).insert({
    //     productId: ProductImage,
    //     image: '',
    //     blobImage: buffer,
    //   })
    // ).generatedMaps[0].id;
    throw new Error('Method not implemented.');
  }

  public async GetImageBuffer(id: number) {
    return (await this.EntityManager.getRepository(Image).findOne({ id: id })).image;
  }

  public async DeleteImage(imageId: number) {
    return await this.EntityManager.getRepository(Image).delete({ id: imageId });
  }
}
