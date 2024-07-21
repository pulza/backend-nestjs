import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BigCategoryDto, CategoryDto, MediumCategoryDto, SmallCategoryDto } from './dto/response/category.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prisma.bigCategory.findMany({
      include: { mediumCategories: { include: { smallCategories: true } } },
    });

    return categories.map((category) => {
      return new CategoryDto(category);
    });
  }

  async findBigCategorySubs(bigCategoryId: number): Promise<CategoryDto> {
    const categories = await this.prisma.bigCategory.findUniqueOrThrow({
      where: { id: bigCategoryId },
      include: { mediumCategories: { include: { smallCategories: true } } },
    });

    return new CategoryDto(categories);
  }

  async findBigCategories(): Promise<BigCategoryDto[]> {
    const bigCategories = await this.prisma.bigCategory.findMany();

    return bigCategories.map((bigCategory) => {
      return new BigCategoryDto(bigCategory);
    });
  }

  async findMediumCategories(bigCategoryId: number): Promise<MediumCategoryDto[]> {
    const mediumCategories = await this.prisma.mediumCategory.findMany({
      where: { bigCategoryId },
    });

    return mediumCategories.map((mediumCategory) => {
      return new MediumCategoryDto(mediumCategory);
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

  async createBig(createCategoryDto: CreateCategoryDto): Promise<void> {
    const isExist = await this.prisma.bigCategory.findFirst({
      where: { name: createCategoryDto.name },
    });
    if (isExist) throw new HttpException('', HttpStatus.CONFLICT);

    await this.prisma.bigCategory.create({
      data: createCategoryDto,
    });
  }

  async updateBig(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    await this.prisma.bigCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.bigCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async removeBig(id: number): Promise<void> {
    await this.prisma.bigCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.bigCategory.delete({
      where: { id },
    });
  }

  async createMedium(bigCategoryId: number, createCategoryDto: CreateCategoryDto): Promise<void> {
    await this.prisma.bigCategory.findUniqueOrThrow({
      where: { id: bigCategoryId },
    });

    const isExist = await this.prisma.mediumCategory.findFirst({
      where: { name: createCategoryDto.name, bigCategoryId },
    });
    if (isExist) throw new HttpException('', HttpStatus.CONFLICT);

    await this.prisma.mediumCategory.create({
      data: { ...createCategoryDto, bigCategoryId },
    });
  }

  async updateMedium(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    await this.prisma.mediumCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.mediumCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async removeMedium(id: number): Promise<void> {
    await this.prisma.mediumCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.mediumCategory.delete({
      where: { id },
    });
  }

  async createSmall(mediumCategoryId: number, createCategoryDto: CreateCategoryDto): Promise<void> {
    await this.prisma.mediumCategory.findUniqueOrThrow({
      where: { id: mediumCategoryId },
    });

    const isExist = await this.prisma.smallCategory.findFirst({
      where: { name: createCategoryDto.name, mediumCategoryId },
    });
    if (isExist) throw new HttpException('', HttpStatus.CONFLICT);

    await this.prisma.smallCategory.create({
      data: { ...createCategoryDto, mediumCategoryId },
    });
  }

  async updateSmall(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    await this.prisma.smallCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.smallCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async removeSmall(id: number): Promise<void> {
    await this.prisma.smallCategory.findUniqueOrThrow({
      where: { id },
    });

    await this.prisma.smallCategory.delete({
      where: { id },
    });
  }
}
