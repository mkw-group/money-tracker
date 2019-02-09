import { observable, observe, action } from 'mobx';
import { SettingsStorage } from 'features/storage';
import { MoneyStore, IMoneyStore } from './MoneyStore';
import { GroupsStore, IAccountGroup } from './GroupsStore';
import { CategoriesStore, ICategory } from './CategoriesStore';

export interface ISettingsStore {
  isSetupComplete: boolean;
  money: IMoneyStore;
  groups: IAccountGroup[];
  categories: ICategory[];
}

export class SettingsStore {
  @observable isSetupComplete: boolean;
  money: MoneyStore;
  groups: GroupsStore;
  categories: CategoriesStore;

  constructor({ isSetupComplete, money, groups, categories }: ISettingsStore) {
    this.isSetupComplete = isSetupComplete;
    this.money = new MoneyStore(money);
    this.groups = new GroupsStore(groups);
    this.categories = new CategoriesStore(categories);

    observe(this, 'isSetupComplete', async ({ newValue }) => {
      await SettingsStorage.persistSetup(newValue);
    });
  }

  static async init(): Promise<SettingsStore> {
    const settings = await SettingsStorage.load();

    return new SettingsStore(settings);
  }

  @action.bound completeSetup() {
    this.isSetupComplete = true;
  }
}
