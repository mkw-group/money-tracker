import { t } from 'ttag';
import { IAccountGroup } from 'features/settings';
import { localDB } from './Database';

let timestamp = Date.now();
const defaultGroups: IAccountGroup[] = [
  { id: `G${timestamp++}`, name: t`Cash` },
  { id: `G${timestamp++}`, name: t`Bank Account` },
  { id: `G${timestamp++}`, name: t`Credit` },
  { id: `G${timestamp++}`, name: t`Deposit` }
];

interface IAccountGroupStorage extends PouchDB.Core.IdMeta {
  name: string;
}

export class GroupsStorage {
  public async loadAll(): Promise<IAccountGroup[]> {
    const docs = await localDB.allDocs<IAccountGroupStorage>({
      include_docs: true,
      conflicts: true,
      startkey: 'G',
      endkey: 'G\uffff'
    });

    if (docs.total_rows === 0) {
      await Promise.all(defaultGroups.map(this.save));

      return defaultGroups;
    }

    return docs.rows.map(({ doc }) => {
      const { _id, name } = doc as IAccountGroupStorage;
      return { id: _id, name };
    });
  }

  public async save({ id, name }: IAccountGroup) {
    try {
      const doc = await localDB.get<IAccountGroupStorage>(id);
      await localDB.put({ ...doc, name });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      await localDB.put<IAccountGroupStorage>({ _id: id, name });
    }
  }

  public async remove({ id }: IAccountGroup) {
    const doc = await localDB.get<IAccountGroupStorage>(id);
    await localDB.remove(doc);
  }
}
