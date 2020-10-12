import { ResponseGrid } from '../../Common';
import { Product } from '../../Models/Entities';
import { ProductsService } from '../../Services';
import { ProductDTO } from '../../Services/Products/DTO';
import { GridParams, Ok, OkResponse } from '../../Common/ResponseFormatter';
import { Controller, Get, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  public async GetAllProducts(@Body() body: GridParams): Promise<ResponseGrid<Product>> {
    return await this.ProductsService.GetAllProducts(body);
  }

  @Post('/archive')
  @HttpCode(HttpStatus.OK)
  public async GetArchive(@Body() body: GridParams): Promise<ResponseGrid<Product>> {
    return await this.ProductsService.GetArchive(body);
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
  public async AddProduct(@Body() body: ProductDTO): Promise<OkResponse> {
    return Ok(await this.ProductsService.AddPrdouct(body, null));
  }

  @Put('/:productId')
  public async ModifyProduct(@Param('productId') productId: number, @Body() body: ProductDTO): Promise<OkResponse> {
    return Ok(await this.ProductsService.ModifyProduct(productId, body, null));
  }

  @Delete('/:productId')
  public async DeleteProduct(@Param('productId') productId: number): Promise<OkResponse> {
    return Ok(await this.ProductsService.DeleteProduct(productId));
  }
}
