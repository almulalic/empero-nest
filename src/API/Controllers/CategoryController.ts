import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../../Services';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @Get('')
  public async GetCategories() {
    return await this.CategoriesService.GetCategories();
  }
}
