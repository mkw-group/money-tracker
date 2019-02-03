import { observable } from 'mobx';

export interface ICategory {
  id: string;
  name: string;
  kind: 'Income' | 'Expense';
  visible: boolean;
  color: string;
  icon: string;
  order: number;
}

export class CategoriesStore {
  @observable cateogires: ICategory[];

  constructor(categories: ICategory[]) {
    this.cateogires = categories;
  }
}
