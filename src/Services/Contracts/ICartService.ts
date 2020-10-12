import { AddToCartDTO } from '../Cart/DTO';
import { Cart } from '../../Models/Entities';

export interface ICartService {
  GetCartItems(currentCustomerId: number): Promise<Cart[]>;
  AddToCart(dto: AddToCartDTO, currentCustomerId: number): Promise<string>;
  RemoveFromCart(cartId: number, currentCustomerId: number): Promise<string>;
}
