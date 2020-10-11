import { ResponseGrid } from '../../Common';
import { ProductDTO } from '../Products/DTO';
import { Product } from '../../Models/Entities';
import { GridParams } from '../../Common/ResponseGrid';

export interface IPrdouctsService {
  GetAllProducts(dto: GridParams): Promise<ResponseGrid<Product>>;
  GetArchive(dto: GridParams): Promise<ResponseGrid<Product>>;
  GetRecommended(): Promise<Product[]>;
  GetSuggested(categoryId: number): Promise<Product[]>;
  GetProduct(productId: number): Promise<Product>;
  AddPrdouct(dto: ProductDTO, productImage: string): Promise<string>;
  ModifyProduct(productId: number, dto: ProductDTO, productImage: string): Promise<string>;
  DeleteProduct(productId: number): Promise<string>;
}
