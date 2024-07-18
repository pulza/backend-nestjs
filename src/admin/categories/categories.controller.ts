import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() createCategoryDto: CreateCategoryDto): void {
    this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): void {
    this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): void {
    this.categoriesService.remove(+id);
  }
}
