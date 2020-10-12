import { InjectEntityManager } from '@nestjs/typeorm';
import { Category } from '../../Models/Entities';
import { ICategoryService } from '../Contracts/ICategoryService';
import { EntityManager } from 'typeorm';
export class CategoriesService implements ICategoryService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  public async GetCategories(): Promise<Category[]> {
    return await this.entityManager.getRepository(Category).find();
  }
}
