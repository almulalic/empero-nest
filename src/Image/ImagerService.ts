import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Productimage } from './../Models/Entities/Productimage';

@Injectable()
export class ImagerService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {}

  public async UploadImage(file: any): Promise<number> {
    return (
      await this.EntityManager.getRepository(Productimage).insert({
        productId: 41,
        image: '',
        blobImage: file.buffer,
      })
    ).generatedMaps[0].id;
  }

  public async UploadProductImage(buffer: Buffer, productImage: number): Promise<number> {
    return (
      await this.EntityManager.getRepository(Productimage).insert({
        productId: productImage,
        image: '',
        blobImage: buffer,
      })
    ).generatedMaps[0].id;
  }

  public async GetImageBuffer(id: number) {
    return (await this.EntityManager.getRepository(Productimage).findOne({ id: id })).blobImage;
  }

  public async DeleteImage(imageId: number) {
    return await this.EntityManager.getRepository(Productimage).delete(imageId);
  }
}
