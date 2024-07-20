import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름', required: true, example: '방통대' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '부모 카테고리 id', required: false, example: 1 })
  @IsOptional()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt()
  parentId?: number | null;

  @ApiProperty({ description: '카테고리 레벨. 최상위 카테고리의 경우 1', required: true, example: 1 })
  @IsNotEmpty()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt()
  index: number;

  constructor(name: string, index: number, parentId?: number) {
    this.name = name;
    this.parentId = parentId;
    this.index = index;
  }
}
