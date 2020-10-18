import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseGrid } from '../../Common';
import { Product } from '../../Models/Entities';
import { ProductsService } from '../../Services';
import { classToPlain } from 'class-transformer';
import { ProductDTO } from '../../Services/Products/DTO';
import { GridParams, Ok, OkResponse } from '../../Common/ResponseFormatter';
import { AuthorizationInterceptor } from '../Auth/AuthorizationInterceptor';
import { AuthenticationInterceptor } from '../Auth/AuthenticationInterceptor';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';

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
  @UseInterceptors(AuthorizationInterceptor)
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

  @Get('/:productId')
  public async GetProduct(@Param('productId') productId: number): Promise<Product> {
    return await this.ProductsService.GetProduct(productId);
  }

  @Post('')
  @UseInterceptors(AuthorizationInterceptor)
  @UseInterceptors(AuthenticationInterceptor)
  @UseInterceptors(FilesInterceptor('image'))
  public async AddProduct(@Body() body: ProductDTO, @UploadedFiles() productImages): Promise<OkResponse> {
    return Ok(await this.ProductsService.AddPrdouct(classToPlain(body) as ProductDTO, productImages));
  }

  @Put('/:productId')
  @UseInterceptors(AuthorizationInterceptor)
  @UseInterceptors(AuthenticationInterceptor)
  public async ModifyProduct(@Param('productId') productId: number, @Body() body: ProductDTO): Promise<OkResponse> {
    return Ok(await this.ProductsService.ModifyProduct(productId, body));
  }

  @Delete('/:productId')
  @UseInterceptors(AuthorizationInterceptor)
  @UseInterceptors(AuthenticationInterceptor)
  public async DeleteProduct(@Param('productId') productId: number): Promise<OkResponse> {
    return Ok(await this.ProductsService.DeleteProduct(productId));
  }
}
