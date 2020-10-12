import { Module } from '@nestjs/common';
import { CategoriesController } from './../Controllers/CategoryController';
import { CategoriesService } from '../../Services/Categories/CategoriesService';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoryModule {}
