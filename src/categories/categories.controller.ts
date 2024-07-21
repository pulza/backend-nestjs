import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto, SmallCategoryDto } from './dto/responses/category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: '카테고리 대분류 Big 및 중분류 Medium 조회', description: 'Role: public' })
  @ApiResponse({ type: CategoryDto, isArray: true })
  @Get()
  @Roles('public')
  findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Small 카테고리 전체 조회', description: 'Role: public' })
  @ApiParam({ name: 'mediumCategoryId', description: 'Medium 카테고리 id' })
  @ApiResponse({ type: SmallCategoryDto, isArray: true })
  @Get('small/:mediumCategoryId')
  @Roles('public')
  findSmallCategories(@Param('mediumCategoryId') mediumCategoryId: string): Promise<SmallCategoryDto[]> {
    return this.categoriesService.findSmallCategories(+mediumCategoryId);
  }
}
