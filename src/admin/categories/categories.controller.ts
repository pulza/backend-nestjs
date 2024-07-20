import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/response/category.dto';
@ApiTags('admin - categories')
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: '카테고리 전체 조회', description: 'Role: public' })
  @ApiResponse({ type: CategoryDto, isArray: true })
  @Get()
  @Roles('public')
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: '카테고리 생성', description: 'Role: admin' })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @Roles('admin')
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '카테고리 수정', description: 'Role: admin' })
  @ApiParam({ name: 'id', description: '카테고리 id' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<void> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: '카테고리 삭제', description: 'Role: admin' })
  @ApiParam({ name: 'id', description: '카테고리 id' })
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(+id);
  }
}
