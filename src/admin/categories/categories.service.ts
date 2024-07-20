import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto/response/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    if (
      (createCategoryDto.parentId === null && createCategoryDto.index !== 0) ||
      (createCategoryDto.parentId && createCategoryDto.index === 0)
    )
      throw new HttpException('', HttpStatus.BAD_REQUEST);

    const isExist = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name, parentId: createCategoryDto.parentId, index: createCategoryDto.index },
    });
    if (isExist) throw new HttpException('', HttpStatus.CONFLICT);

    const superParentId = createCategoryDto.parentId ? await this.findSuperParentId(createCategoryDto.parentId) : null;

    await this.prisma.category.create({
      data: { superParentId, ...createCategoryDto },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    await this.prisma.category.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.category.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.category.delete({
      where: { id },
    });

    // TODO: 자식 카테고리도 삭제 -> 자식의 자식도 있으면 계속 삭제해야하므로 dfs로 구현 or 테이블 구조 변경
  }

  private async findSuperParentId(parentId: number): Promise<number> {
    const isPresent = await this.prisma.category.findFirst({
      where: { id: parentId },
    });
    if (!isPresent) throw new HttpException('', HttpStatus.BAD_REQUEST);

    const superParentId = isPresent.superParentId || parentId;

    return superParentId;
  }
}
