import { ApiProperty } from '@nestjs/swagger';
import { BigCategory, MediumCategory, SmallCategory } from '@prisma/client';

class SubCategoryDto {
  id: number;
  name: string;

  constructor(mediumCategory: MediumCategory) {
    this.id = mediumCategory.id;
    this.name = mediumCategory.name;
  }
}

export class CategoryDto {
  @ApiProperty({ description: '대분류 bigCategory id', example: 1 })
  id: number;

  @ApiProperty({ description: '대분류 이름', example: '방통대' })
  name: string;

  @ApiProperty({
    description: '대분류의 중분류들',
    required: true,
    example: [
      {
        id: 1,
        name: '컴퓨터과학과',
      },
      {
        id: 2,
        name: '중어중문학과',
      },
    ],
  })
  subCategories: SubCategoryDto[];

  constructor(category: BigCategory & { mediumCategories: MediumCategory[] }) {
    this.id = category.id;
    this.name = category.name;
    this.subCategories = category.mediumCategories.map((mediumCategory) => {
      return new SubCategoryDto(mediumCategory);
    });
  }
}

export class SmallCategoryDto {
  @ApiProperty({ description: '소분류 smallCategory id', example: 1 })
  id: number;

  @ApiProperty({ description: '소분류 이름', example: '알고리즘' })
  name: string;

  @ApiProperty({ description: '소분류가 속하는 중분류 mediumCategory id', example: 1 })
  mediumCategoryId: number;

  constructor(smallCategory: SmallCategory) {
    this.id = smallCategory.id;
    this.name = smallCategory.name;
    this.mediumCategoryId = smallCategory.mediumCategoryId;
  }
}
