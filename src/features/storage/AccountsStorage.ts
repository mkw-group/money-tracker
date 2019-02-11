import { AssetId, IAccount } from 'features/settings';
import { localDB } from './Database';

interface IAccountStorage extends PouchDB.Core.IdMeta {
  name: string;
  assets: AssetId[];
  balance: Record<AssetId, number>;
}

export class AccountsStorage {
  public async loadAll(): Promise<IAccount[]> {
    const docs = await localDB.allDocs<IAccountStorage>({
      include_docs: true,
      conflicts: true,
      startkey: 'A',
      endkey: 'A\uffff'
    });

    return docs.rows.map(({ doc }) => {
      const { _id, name, assets, balance } = doc as IAccountStorage;
      return { id: _id, name, assets, balance };
    });
  }

  public async save({ id, name, assets, balance }: IAccount) {
    try {
      const doc = await localDB.get<IAccountStorage>(id);
      await localDB.put({ ...doc, name });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      await localDB.put<IAccountStorage>({ _id: id, name, assets, balance });
    }
  }

  public async remove({ id }: IAccount) {
    const doc = await localDB.get<IAccountStorage>(id);
    await localDB.remove(doc);
  }
}
