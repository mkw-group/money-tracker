import { observable, observe, action, Lambda } from 'mobx';
import { MoneySettingsStore, MoneySettingsJsonT } from './MoneySettingsStore';
import { GroupSettingsStore, AccountGroupT } from './GroupSettingsStore';
import { CategorySettingsStore, CategoryT } from './CategorySettingsStore';
import { SettingsDB } from './SettingsDB';

export interface SettingsJsonT {
  _id: string;
  isSetupComplete: boolean;
  money: MoneySettingsJsonT;
  groups: AccountGroupT[];
  categories: CategoryT[];
}

export class SettingsStore {
  @observable isSetupComplete: boolean;
  @observable money: MoneySettingsStore;
  @observable groups: GroupSettingsStore;
  @observable categories: CategorySettingsStore;
  onChangeDisposer: Lambda;

  constructor({ isSetupComplete, money, groups, categories }: SettingsJsonT) {
    this.isSetupComplete = isSetupComplete;
    this.money = new MoneySettingsStore(money);
    this.groups = new GroupSettingsStore(groups);
    this.categories = new CategorySettingsStore(categories);

    this.onChangeDisposer = observe(
      this,
      'isSetupComplete',
      async ({ newValue }) => {
        await SettingsDB.saveSetupComplete(newValue);
      }
    );
  }

  static async init(): Promise<SettingsStore> {
    const settings = await SettingsDB.loadJson();

    return new SettingsStore(settings);
  }

  @action.bound completeSetup() {
    this.isSetupComplete = true;
  }

  discard() {
    this.onChangeDisposer();
    this.money.discard();
    this.groups.discard();
  }
}
