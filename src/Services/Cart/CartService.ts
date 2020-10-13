import { AddToCartDTO } from './DTO';
import { EntityManager } from 'typeorm';
import { ICartService } from '../Contracts';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Cart, Product } from '../../Models/Entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as responseMessages from '../../../responseMessages.config.json';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {}

  public GetCartItems = async (currentCustomerId: number): Promise<Cart[]> => {
    return await this.EntityManager.getRepository(Cart)
      .createQueryBuilder()
      .innerJoinAndSelect('Cart.product', 'Product')
      .where('Cart.customerId = :id', {
        id: currentCustomerId,
      })
      .getMany();
  };

  public AddToCart = async (dto: AddToCartDTO, currentCustomerId: number): Promise<string> => {
    let product: Product = await this.EntityManager.getRepository(Product).findOne({ id: dto.productId });

    if (!product) throw new HttpException(responseMessages.cart.add.nonExistingProduct, HttpStatus.NOT_FOUND);

    dto.customerId = currentCustomerId;
    dto.totalPrice = product.price * dto.quantity;

    await this.EntityManager.getRepository(Cart).insert(dto);

    return responseMessages.cart.add.success;
  };

  public RemoveFromCart = async (cartId: number, currentCustomerId: number): Promise<string> => {
    let cartItem: Cart = await this.EntityManager.getRepository(Cart).findOne({
      id: cartId,
      customerId: currentCustomerId,
    });

    if (!cartItem) throw new HttpException(responseMessages.cart.remove.nonExistingProduct, HttpStatus.NOT_FOUND);

    await this.EntityManager.getRepository(Cart).delete(cartId);

    return responseMessages.cart.remove.success;
  };
}
