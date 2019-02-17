import { IMoneyStore } from 'features/settings';
import { localDB } from './Database';

type IMoneyStorage = IMoneyStore & PouchDB.Core.IdMeta;

export class MoneyStorage {
  private documentId: string = 'MONEY';

  private getDefault(): IMoneyStore {
    return {
      exchangeRate: {},
      baseCurrency: '',
      assets: []
    };
  }

  public async load(): Promise<IMoneyStore> {
    try {
      const { exchangeRate, baseCurrency, assets } = await localDB.get<
        IMoneyStorage
      >(this.documentId);

      return { exchangeRate, baseCurrency, assets };
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      return this.getDefault();
    }
  }

  public async save(money: IMoneyStore) {
    try {
      const doc = await localDB.get<IMoneyStorage>(this.documentId);
      await localDB.put({ ...doc, ...money });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      await localDB.put<IMoneyStorage>({
        _id: this.documentId,
        ...money
      });
    }
  }
}
