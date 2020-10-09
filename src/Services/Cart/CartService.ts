import { classToPlain } from 'class-transformer';
import { AddToCartDTO } from './DTO';
import { ICartService } from '../Contracts';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Cart, Product } from '../../Models/Entities';
import {
  Connection,
  createQueryBuilder,
  EntityManager,
  getConnection,
  Repository,
} from 'typeorm';
import * as responseMessages from '../../../responseMessages.config.json';

@Injectable()
class CartService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  public GetCartContent = async (
    currentCustomerId: number,
  ): Promise<Cart[]> => {
    return classToPlain(
      await this.entityManager
        .createQueryBuilder()
        .from(Cart, 'Cart')
        .innerJoinAndSelect('Cart.product', 'Product')
        .where('Cart.customerId = :id', {
          id: currentCustomerId,
        })
        .getMany(),
    ) as Cart[];
  };

  public AddToCart = async (
    dto: AddToCartDTO,
    currentCustomerId: number,
  ): Promise<string> => {
    let product = await this.entityManager
      .getRepository(Product)
      .findOne({ id: dto.productId });

    if (!product)
      throw new HttpException(
        responseMessages.cart.add.nonExistingProduct,
        HttpStatus.NOT_FOUND,
      );

    dto.customerId = currentCustomerId;
    dto.totalPrice = product.price * dto.quantity;

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Cart)
      .values(dto)
      .execute();

    return responseMessages.cart.add.success;
  };

  public RemoveFromCart = async (
    cartId: number,
    currentCustomerId: number,
  ): Promise<string> => {
    let cartItem: Cart = await createQueryBuilder(Cart)
      .where('Cart.id = :cartId', { cartId: cartId })
      .andWhere('Cart.customerId = :customerId', {
        customerId: currentCustomerId,
      })
      .getOne();

    if (!cartItem)
      throw new HttpException(
        responseMessages.cart.delete.nonExistingProduct,
        HttpStatus.NOT_FOUND,
      );

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Cart)
      .where('Cart.Id = :id', { id: cartId })
      .execute();

    return responseMessages.cart.delete.success;
  };
}

export default CartService;
