import { EntityManager } from 'typeorm';
import { Category } from '../../Models/Entities';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ICategoryService } from '../Contracts/ICategoryService';
export class CategoriesService implements ICategoryService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
  ) {}

  public async GetCategories(): Promise<Category[]> {
    return await this.EntityManager.getRepository(Category).find();
  }
}
