import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ImageType } from '../../Common/Enumerations';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Image, ProductImage } from '../../Models/Entities';

@Injectable()
export class ImagerService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {}

  public async UploadImage(image: any, type: ImageType): Promise<number> {
    return (
      await this.EntityManager.getRepository(Image).insert({
        image: image.buffer,
        type: type,
        mimetype: image.mimetype,
        encoding: image.encoding,
        sizeInKb: image.size,
      })
    ).generatedMaps[0].id;
  }

  public async UploadProductImage(image: any, productId: number): Promise<number> {
    let productImageId = await this.UploadImage(image, ImageType.Product);

    return (
      await this.EntityManager.getRepository(ProductImage).insert({
        productId: productId,
        imageId: productImageId,
      })
    ).generatedMaps[0].id;
  }

  public async GetImageBuffer(id: number) {
    return (await this.EntityManager.getRepository(Image).findOne({ id: id })).image;
  }

  public async DeleteImage(imageId: number) {
    return await this.EntityManager.getRepository(Image).delete({ id: imageId });
  }
}
