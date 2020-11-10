import { DateTime } from 'luxon';
import { ProductDTO } from './DTO';
import { IPrdouctsService } from '../Contracts';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ImagerService } from '../../Microservices/Image/ImagerService';
import { Category, Product, ProductImage } from '../../Models/Entities';
import * as responseMessages from '../../../responseMessages.config.json';
import { GridParams, ResponseGrid } from '../../Common/ResponseFormatter';

@Injectable()
export class ProductsService implements IPrdouctsService {
  constructor(
    @InjectEntityManager()
    private readonly EntityManager: EntityManager,
    private readonly ImagerService: ImagerService,
  ) {}

  public async GetAllProducts(dto: GridParams): Promise<ResponseGrid<Product>> {
    let products: Product[] = await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category')
      .innerJoinAndSelect('Product.productimages', 'ProductImage')
      .orderBy(`Product.${dto.sortBy || 'createdAt'}`, dto.order || 'ASC')
      .getMany();

    return new ResponseGrid(products).GetGridData(dto);
  }

  public async GetArchive(dto: GridParams): Promise<ResponseGrid<Product>> {
    let archive: Product[] = await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category')
      .innerJoinAndSelect('Product.productimages', 'ProductImage')
      .where('Product.archivedAt IS NOT NULL')
      .orderBy(`Product.${dto.sortBy || `createdAt`}`, dto.order || 'ASC')
      .getMany();

    return new ResponseGrid(archive).GetGridData(dto);
  }

  public async GetRecommended(): Promise<Product[]> {
    return (await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category')
      .innerJoinAndSelect('Product.productimages', 'ProductImage')
      .where('Product.archivedAt IS NULL')
      .andWhere('Product.isRecommended = true')
      .getMany()) as Product[];
  }

  public async GetSuggested(categoryId: number): Promise<Product[]> {
    return (await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category')
      .innerJoinAndSelect('Product.productimages', 'ProductImage')
      .where('Product.categoryId = :categoryId', { categoryId: categoryId })
      .andWhere('Product.archivedAt IS NULL')
      .orderBy('RAND()')
      .take(4)
      .getMany()) as Product[];
  }

  public async GetProduct(productId: number): Promise<Product> {
    let product: Product = await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category')
      .innerJoinAndSelect('Product.productimages', 'ProductImage')
      .where('Product.id = :id', { id: productId })
      .getOne();

    if (!product) throw new HttpException(responseMessages.product.getOne.nonExistingProduct, HttpStatus.NOT_FOUND);

    return product;
  }

  public async AddPrdouct(dto: ProductDTO, ProductImages): Promise<string> {
    if (ProductImages.length == 0)
      throw new HttpException(responseMessages.product.add.noImagesProvided, HttpStatus.BAD_REQUEST);

    if (dto.primaryImageId && dto.primaryImageId > ProductImages.length)
      throw new HttpException(responseMessages.product.add.invalidImageIndex, HttpStatus.BAD_REQUEST);

    let category: Category = await this.EntityManager.getRepository(Category).findOne({ id: dto.categoryId });
    if (!category) throw new HttpException(responseMessages.product.add.nonExistingCategory, HttpStatus.NOT_FOUND);

    dto.primaryImageId = dto.primaryImageId ? dto.primaryImageId - 1 : 0;
    let productId = (await this.EntityManager.getRepository(Product).insert(dto)).generatedMaps[0].id;

    ProductImages.forEach(async (productImage) => {
      await this.ImagerService.UploadProductImage(productImage, productId);
    });

    return responseMessages.product.add.success;
  }

  public async ModifyProduct(productId: number, dto: ProductDTO): Promise<string> {
    let product: Product = await this.EntityManager.getRepository(Product).findOne({ id: productId });

    if (!product) throw new HttpException(responseMessages.product.modify.nonExistingProduct, HttpStatus.NOT_FOUND);

    if (product.categoryId !== dto.categoryId) {
      let category: Category = await this.EntityManager.getRepository(Category).findOne({ id: dto.categoryId });

      if (!category) throw new HttpException(responseMessages.product.modify.nonExistingCategory, HttpStatus.NOT_FOUND);
    }

    let modifiedProduct: Product = dto;

    modifiedProduct.id = product.id;
    modifiedProduct.createdAt = product.createdAt;
    modifiedProduct.archivedAt = product.archivedAt;

    await this.EntityManager.getRepository(Product).save(modifiedProduct);

    return responseMessages.product.modify.success;
  }

  public async DeleteProduct(productId: number): Promise<string> {
    let product: Product = await this.EntityManager.getRepository(Product)
      .createQueryBuilder()
      .addSelect('Order.archivedAt')
      .where('Order.id = :id', { id: productId })
      .getOne();

    if (!product) throw new HttpException(responseMessages.product.remove.nonExistingProduct, HttpStatus.NOT_FOUND);
    else if (product.archivedAt !== null)
      throw new HttpException(responseMessages.product.remove.alreadyArchivedProduct, HttpStatus.NOT_FOUND);

    let ProductImages: ProductImage[] = await this.EntityManager.getRepository(ProductImage).find({
      productId: product.id,
    });

    ProductImages.forEach(async (ProductImage: ProductImage) => {
      await this.ImagerService.DeleteImage(ProductImage.id);
    });

    await this.EntityManager.getRepository(Product).update(product.id, { archivedAt: DateTime.utc().toSQL() });

    return responseMessages.product.remove.success;
  }
}
