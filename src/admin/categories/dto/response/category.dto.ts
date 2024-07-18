export interface CategoryInterface {
  id: number;
  name: string;
  index: number;
}

export class CategoryResponseDto {
  id: number;
  name: string;
  index: number;
  children: CategoryResponseDto[];

  constructor(category: CategoryInterface, children: CategoryInterface[] = []) {
    this.id = category.id;
    this.name = category.name;
    this.index = category.index;
    this.children = children.map((child) => new CategoryResponseDto(child));
    console.log(1, this.children);
  }
}
