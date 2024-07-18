import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt()
  parentId: number | null;

  @IsNotEmpty()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt()
  index: number;

  constructor(name: string, parentId: number, index: number) {
    this.name = name;
    this.parentId = parentId;
    this.index = index;
  }
}
