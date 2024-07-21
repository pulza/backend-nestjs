import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto, SmallCategoryDto } from './dto/responses/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prisma.bigCategory.findMany({
      include: { mediumCategories: true },
    });

    return categories.map((category) => {
      return new CategoryDto(category);
    });
  }

  async findSmallCategories(mediumCategoryId: number): Promise<SmallCategoryDto[]> {
    const smallCategories = await this.prisma.smallCategory.findMany({
      where: { mediumCategoryId },
    });

    return smallCategories.map((smallCategory) => {
      return new SmallCategoryDto(smallCategory);
    });
  }
}
