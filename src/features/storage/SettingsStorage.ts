import PouchDB from 'pouchdb';
import {
  ISettingsStore,
  IMoneyStore,
  IAccountGroup,
  ICategory
} from 'features/settings';

interface ISetupStorage {
  _id: string;
  isSetupComplete: boolean;
}

interface IGroupsStorage {
  _id: string;
  groups: IAccountGroup[];
}

interface ICategoriesStorage {
  _id: string;
  categories: ICategory[];
}

interface IMoneyStorage extends IMoneyStore {
  _id: string;
}

const SettingsDB = new PouchDB('settings', {
  auto_compaction: true
});

export class SettingsStorage {
  static async load(): Promise<ISettingsStore> {
    const { isSetupComplete } = await SettingsStorage.loadSetup();
    const { groups } = await SettingsStorage.loadGroups();
    const { categories } = await SettingsStorage.loadCategories();
    const {
      baseCurrency,
      assets,
      exchangeRate
    } = await SettingsStorage.loadMoney();

    return {
      isSetupComplete,
      groups,
      categories,
      money: {
        baseCurrency,
        assets,
        exchangeRate
      }
    };
  }

  private static async loadSetup(): Promise<ISetupStorage> {
    const storageId = 'setup';
    try {
      return await SettingsDB.get(storageId);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      return {
        _id: storageId,
        isSetupComplete: false
      };
    }
  }

  private static async loadGroups(): Promise<IGroupsStorage> {
    const storageId = 'groups';
    try {
      return await SettingsDB.get<IGroupsStorage>(storageId);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      let timestamp = Date.now();

      return {
        _id: storageId,
        groups: [
          { id: `G${timestamp++}`, name: 'Cash' },
          { id: `G${timestamp++}`, name: 'Bank Account' },
          { id: `G${timestamp++}`, name: 'Credit' },
          { id: `G${timestamp++}`, name: 'Deposit' }
        ]
      };
    }
  }

  private static async loadCategories(): Promise<ICategoriesStorage> {
    const storageId = 'categories';
    try {
      return await SettingsDB.get<ICategoriesStorage>(storageId);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      return {
        _id: storageId,
        categories: []
      };
    }
  }

  private static async loadMoney(): Promise<IMoneyStorage> {
    const storageId = 'money';
    try {
      return await SettingsDB.get<IMoneyStorage>(storageId);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      return {
        _id: storageId,
        exchangeRate: {},
        baseCurrency: '',
        assets: []
      };
    }
  }

  static async persistSetup(isSetupComplete: boolean): Promise<void> {
    const doc = await SettingsStorage.loadSetup();

    await SettingsDB.put({ ...doc, isSetupComplete });
  }

  static async persistGroups(groups: IAccountGroup[]): Promise<void> {
    const doc = await SettingsStorage.loadGroups();

    await SettingsDB.put<IGroupsStorage>({ ...doc, groups });
  }

  static async persistCategories(categories: ICategory[]): Promise<void> {
    const doc = await SettingsStorage.loadCategories();

    await SettingsDB.put<ICategoriesStorage>({ ...doc, categories });
  }

  static async persistMoney(money: IMoneyStore): Promise<void> {
    const doc = await SettingsStorage.loadMoney();

    await SettingsDB.put<IMoneyStorage>({ ...doc, ...money });
  }
}
