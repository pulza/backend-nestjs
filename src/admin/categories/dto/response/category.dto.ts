export interface CategoryInterface {
  id: number;
  name: string;
  index: number;
}

export class CategoryDto {
  id: number;
  name: string;
  index: number;
  children: CategoryDto[];

  constructor(category: CategoryInterface, children: CategoryInterface[] = []) {
    this.id = category.id;
    this.name = category.name;
    this.index = category.index;
    this.children = children.map((child) => new CategoryDto(child));
  }
}
