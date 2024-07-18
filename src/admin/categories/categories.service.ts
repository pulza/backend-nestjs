import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import { CategoryResponseDto } from './dto/response/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const superParentId = await this.findSuperParentId(
      createCategoryDto.parentId,
      createCategoryDto.index,
    );

    const category = await this.prisma.category.create({
      data: { superParentId, ...createCategoryDto },
    });

    return category;
  }

  async findAll() {
    const superParentCategoies = await this.prisma.category.findMany({
      where: { index: 0 },
    });
    const childCategories = await this.prisma.category.findMany({
      where: { index: { not: 0 } },
    });
    const parentIdOfCategoryObject: { [key: number]: CategoryResponseDto[] } =
      {};
    const categoryResponse: CategoryResponseDto[] = [];

    childCategories.forEach((child) => {
      if (!child.parentId) return;
      if (!parentIdOfCategoryObject[child.parentId])
        parentIdOfCategoryObject[child.parentId] = [];

      parentIdOfCategoryObject[child.parentId].push({
        id: child.id,
        name: child.name,
        index: child.index,
        children: [],
      });
    });

    superParentCategoies.forEach((superParentCategory) => {
      const obj = {
        id: superParentCategory.id,
        name: superParentCategory.name,
        index: superParentCategory.index,
        children: parentIdOfCategoryObject[superParentCategory.id] || [],
      };
      this.setChildCategories(obj.children, parentIdOfCategoryObject);
      categoryResponse.push(obj);
    });

    return categoryResponse;
  }

  private setChildCategories(
    parentCategories: CategoryResponseDto[],
    parentIdOfCategoryObject: { [key: number]: CategoryResponseDto[] },
  ) {
    return parentCategories.map((parent) => {
      parent.children = parentIdOfCategoryObject[parent.id] || [];

      this.setChildCategories(parent.children, parentIdOfCategoryObject);
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return category;
  }

  remove(id: number): void {
    this.prisma.category.delete({
      where: { id },
    });
  }

  private async findSuperParentId(
    parentId: number | null,
    index: number,
  ): Promise<number | null> {
    if (parentId === null && index !== 0)
      throw new HttpException('', HttpStatus.BAD_REQUEST);

    let superParentId = null;
    if (parentId) {
      const isPresent = await this.prisma.category.findFirst({
        where: { id: parentId },
      });
      if (!isPresent) throw new HttpException('', HttpStatus.BAD_REQUEST);
      superParentId = isPresent.superParentId;
    }

    return superParentId;
  }
}
