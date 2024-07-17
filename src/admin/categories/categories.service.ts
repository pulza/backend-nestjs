import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    await this.validate(createCategoryDto.parentId, createCategoryDto.index);

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
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

  private async validate(parentId: number | null, index: number) {
    if (parentId === null && index !== 0) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    } else if (parentId) {
      const isPresent = await this.prisma.category.findFirst({
        where: { id: parentId },
      });
      if (!isPresent) throw new HttpException('', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
