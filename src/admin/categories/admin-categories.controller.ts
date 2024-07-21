import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BigCategoryDto, CategoryDto, MediumCategoryDto } from './dto/responses/category.dto';

@ApiTags('admin - categories')
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @ApiOperation({ summary: '카테고리 전체 조회', description: 'Role: admin' })
  @ApiResponse({ type: CategoryDto, isArray: true })
  @Get()
  @Roles('admin')
  findAll() {
    return this.adminCategoriesService.findAll();
  }

  @ApiOperation({ summary: 'Big 카테고리의 medium 및 small 카테고리 전체 조회', description: 'Role: admin' })
  @ApiParam({ name: 'bigCategoryId', description: 'Big 카테고리 id' })
  @ApiResponse({ type: CategoryDto })
  @Get(':bigCategoryId')
  @Roles('admin')
  findBigCategorySubs(@Param('bigCategoryId') bigCategoryId: string) {
    return this.adminCategoriesService.findBigCategorySubs(+bigCategoryId);
  }

  @ApiOperation({ summary: 'Big 카테고리 전체 조회', description: 'Role: admin' })
  @ApiResponse({ type: BigCategoryDto, isArray: true })
  @Get('big')
  @Roles('admin')
  findBigCategories() {
    return this.adminCategoriesService.findBigCategories();
  }

  @ApiOperation({ summary: 'Medium 카테고리 전체 조회', description: 'Role: admin' })
  @ApiParam({ name: 'bigCategoryId', description: 'Big 카테고리 id' })
  @ApiResponse({ type: MediumCategoryDto, isArray: true })
  @Get('medium/:bigCategoryId')
  @Roles('admin')
  findMediumCategories(@Param('bigCategoryId') bigCategoryId: string) {
    return this.adminCategoriesService.findMediumCategories(+bigCategoryId);
  }

  @ApiOperation({ summary: 'Small 카테고리 전체 조회', description: 'Role: admin' })
  @ApiParam({ name: 'mediumCategoryId', description: 'Medium 카테고리 id' })
  @Get('small/:mediumCategoryId')
  @Roles('admin')
  findSmallCategories(@Param('mediumCategoryId') mediumCategoryId: string) {
    return this.adminCategoriesService.findSmallCategories(+mediumCategoryId);
  }

  @ApiOperation({ summary: '대분류 Big 카테고리 생성', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateCategoryDto })
  @Post('big')
  @Roles('admin')
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    return this.adminCategoriesService.createBig(createCategoryDto);
  }

  @ApiOperation({ summary: '대분류 Big 카테고리 수정', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'bigCategoryId', description: 'Big 카테고리 id' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch('big/:bigCategoryId')
  @Roles('admin')
  update(@Param('bigCategoryId') bigCategoryId: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<void> {
    return this.adminCategoriesService.updateBig(+bigCategoryId, updateCategoryDto);
  }

  @ApiOperation({ summary: '대분류 Big 카테고리 삭제', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'bigCategoryId', description: 'Big 카테고리 id' })
  @Delete('big/:bigCategoryId')
  @Roles('admin')
  remove(@Param('bigCategoryId') bigCategoryId: string): Promise<void> {
    return this.adminCategoriesService.removeBig(+bigCategoryId);
  }

  @ApiOperation({ summary: '중분류 Medium 카테고리 생성', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'bigCategoryId', description: 'Big 카테고리 id' })
  @ApiBody({ type: CreateCategoryDto })
  @Post('medium/:bigCategoryId')
  @Roles('admin')
  createMedium(
    @Param('bigCategoryId') bigCategoryId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<void> {
    return this.adminCategoriesService.createMedium(+bigCategoryId, createCategoryDto);
  }

  @ApiOperation({ summary: '중분류 Medium 카테고리 수정', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'mediumCategoryId', description: 'Medium 카테고리 id' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch('medium/:mediumCategoryId')
  @Roles('admin')
  updateMedium(
    @Param('mediumCategoryId') mediumCategoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return this.adminCategoriesService.updateMedium(+mediumCategoryId, updateCategoryDto);
  }

  @ApiOperation({ summary: '중분류 Medium 카테고리 삭제', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'mediumCategoryId', description: 'Medium 카테고리 id' })
  @Delete('medium/:mediumCategoryId')
  @Roles('admin')
  removeMedium(@Param('mediumCategoryId') mediumCategoryId: string): Promise<void> {
    return this.adminCategoriesService.removeMedium(+mediumCategoryId);
  }

  @ApiOperation({ summary: '소분류 Small 카테고리 생성', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'mediumCategoryId', description: 'Medium 카테고리 id' })
  @ApiBody({ type: CreateCategoryDto })
  @Post('small/:mediumCategoryId')
  @Roles('admin')
  createSmall(
    @Param('mediumCategoryId') mediumCategoryId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<void> {
    return this.adminCategoriesService.createSmall(+mediumCategoryId, createCategoryDto);
  }

  @ApiOperation({ summary: '소분류 Small 카테고리 수정', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'smallCategoryId', description: 'Small 카테고리 id' })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch('small/:smallCategoryId')
  @Roles('admin')
  updateSmall(
    @Param('smallCategoryId') smallCategoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return this.adminCategoriesService.updateSmall(+smallCategoryId, updateCategoryDto);
  }

  @ApiOperation({ summary: '소분류 Small 카테고리 삭제', description: 'Role: admin' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'smallCategoryId', description: 'Small 카테고리 id' })
  @Delete('small/:smallCategoryId')
  @Roles('admin')
  removeSmall(@Param('smallCategoryId') smallCategoryId: string): Promise<void> {
    return this.adminCategoriesService.removeSmall(+smallCategoryId);
  }
}
