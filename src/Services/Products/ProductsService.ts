import { DateTime } from 'luxon';
import { ProductDTO } from './DTO';
import { IPrdouctsService } from '../Contracts';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Category, Product } from '../../Models/Entities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as responseMessages from '../../../responseMessages.config.json';
import { GridParams, ResponseGrid } from '../../Common/ResponseGrid';

@Injectable()
export class ProductsService implements IPrdouctsService {
  private productsScope: SelectQueryBuilder<Product>;

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    this.productsScope = this.entityManager
      .getRepository(Product)
      .createQueryBuilder()
      .innerJoinAndSelect('Product.category', 'Category');
  }

  public GetAllProducts = async (dto: GridParams): Promise<ResponseGrid<Product>> => {
    let products: Product[] = await this.productsScope
      .where('Product.archivedAt IS NULL')
      .orderBy(`Product.${dto.sortBy || 'createdAt'}`, dto.order || 'ASC')
      .getMany();

    return new ResponseGrid(products).GetGridData(dto);
  };

  public GetArchive = async (dto: GridParams): Promise<ResponseGrid<Product>> => {
    let archive: Product[] = await this.productsScope
      .where('Product.archivedAt IS NOT NULL')
      .orderBy(`Product.${dto.sortBy || `createdAt`}`, dto.order || 'ASC')
      .getMany();

    return new ResponseGrid(archive).GetGridData(dto);
  };

  public GetRecommended = async (): Promise<Product[]> => {
    return (await this.productsScope
      .where('Product.archivedAt IS NULL')
      .andWhere('Product.isRecommended = true')
      .getMany()) as Product[];
  };

  public GetSuggested = async (categoryId: number): Promise<Product[]> => {
    return (await this.productsScope
      .where('Product.categoryId = :categoryId', { categoryId: categoryId })
      .andWhere('Product.archivedAt IS NULL')
      .orderBy('RAND()')
      .take(4)
      .getMany()) as Product[];
  };

  public GetProduct = async (productId: number): Promise<Product> => {
    let product: Product = await this.entityManager.getRepository(Product).findOne({ id: productId });

    if (!product) throw new HttpException(responseMessages.product.getOne.nonExistingProduct, HttpStatus.NOT_FOUND);

    return product;
  };

  public AddPrdouct = async (dto: ProductDTO, productImage: string): Promise<string> => {
    let category: Category = await this.entityManager.getRepository(Category).findOne({ id: dto.categoryId });

    if (!category) throw new HttpException(responseMessages.product.add.nonExistingCategory, HttpStatus.NOT_FOUND);

    dto.image = productImage;

    await this.entityManager.getRepository(Product).insert(dto);

    return responseMessages.product.add.success;
  };

  public ModifyProduct = async (productId: number, dto: ProductDTO, productImage: string): Promise<string> => {
    let product: Product = await this.entityManager.getRepository(Product).findOne({ id: productId });

    if (!product) throw new HttpException(responseMessages.product.modify.nonExistingProduct, HttpStatus.NOT_FOUND);

    // If category changed
    if (product.categoryId !== dto.categoryId) {
      let category: Category = await this.entityManager.getRepository(Category).findOne({ id: dto.categoryId });

      if (!category) throw new HttpException(responseMessages.product.modify.nonExistingCategory, HttpStatus.NOT_FOUND);
    }

    let modifiedProduct: Product = dto;

    modifiedProduct.id = product.id;
    modifiedProduct.image = productImage;
    modifiedProduct.createdAt = product.createdAt;
    modifiedProduct.archivedAt = product.archivedAt;

    await this.entityManager.getRepository(Product).save(modifiedProduct);

    return responseMessages.product.update.success;
  };

  public DeleteProduct = async (productId: number): Promise<string> => {
    let product: Product = await this.entityManager.getRepository(Product).findOne({ id: productId });

    if (!product) throw new HttpException(responseMessages.product.remove.nonExistingProduct, HttpStatus.NOT_FOUND);
    else if (product.archivedAt !== null)
      throw new HttpException(responseMessages.product.remove.alreadyArchivedProduct, HttpStatus.NOT_FOUND);

    await this.entityManager.getRepository(Product).update(product.id, { archivedAt: DateTime.utc().toSQL() });

    return responseMessages.product.remove.success;
  };
}
