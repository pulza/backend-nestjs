import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름', required: true, example: '방통대' })
  @IsNotEmpty()
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
