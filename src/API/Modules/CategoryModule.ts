import { Module } from '@nestjs/common';
import { CategoriesService } from '../../Services/Categories/CategoriesService';
import { CategoriesController } from './../Controllers/CategoryController';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoryModule {}
