import { ResponseGrid } from '../../Common';
import { Product } from '../../Models/Entities';
import { ProductsService } from '../../Services';
import { ProductDTO } from '../../Services/Products/DTO';
import { GridParams } from './../../Common/ResponseGrid/ResponseGrid';
import { Controller, Get, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  public async GetAllProducts(@Body() dto: GridParams): Promise<ResponseGrid<Product>> {
    return await this.ProductsService.GetAllProducts(dto);
  }

  @Post('/archive')
  @HttpCode(HttpStatus.OK)
  public async GetArchive(@Body() dto: GridParams): Promise<ResponseGrid<Product>> {
    return await this.ProductsService.GetArchive(dto);
  }

  @Get('/recommended')
  public async GetRecommended(): Promise<Product[]> {
    return await this.ProductsService.GetRecommended();
  }

  @Get('/suggested/:categoryId')
  public async GetSuggested(@Param('categoryId') categoryId: number): Promise<Product[]> {
    return await this.ProductsService.GetSuggested(categoryId);
  }

  @Get('/suggested/:productId')
  public async GetProduct(@Param('productId') productId: number): Promise<Product> {
    return await this.ProductsService.GetProduct(productId);
  }

  @Post()
  public async AddProduct(@Body() dto: ProductDTO): Promise<string> {
    return await this.ProductsService.AddPrdouct(dto, null);
  }

  @Put('/:productId')
  public async UpdateProduct(@Param('productId') productId: number, @Body() dto: ProductDTO): Promise<string> {
    return await this.ProductsService.UpdateProduct(productId, dto, null);
  }

  @Delete('/:productId')
  public async DeleteProduct(@Param('productId') productId: number): Promise<string> {
    return await this.ProductsService.DeleteProduct(productId);
  }
}
