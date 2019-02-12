import { AccountId, GroupId, ISettingsStore } from 'features/settings';
import { localDB } from './Database';

interface ISettingsStorage extends PouchDB.Core.IdMeta {
  isSetupComplete: boolean;
  groups: GroupId[];
  accounts: Record<GroupId, AccountId[]>;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export class SettingsStorage {
  private documentId: string = 'SETTINGS';

  constructor(private defaultGroupIds: GroupId[]) {}

  private getDefaultSettings(): ISettingsStore {
    return {
      isSetupComplete: false,
      groups: this.defaultGroupIds,
      accounts: this.defaultGroupIds.reduce(
        (acc, groupId) => {
          acc[groupId] = [];
          for (let i = 0; i < getRandomInt(0, 4); i++) {
            acc[groupId].push(`A${getRandomInt(1000, 100000)}`);
          }

          return acc;
        },
        {} as Record<GroupId, AccountId[]>
      )
    };
  }

  public async load(): Promise<ISettingsStore> {
    try {
      const { isSetupComplete, groups, accounts } = await localDB.get<
        ISettingsStorage
      >(this.documentId);

      return { isSetupComplete, groups, accounts };
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

      return this.getDefaultSettings();
    }
  }

  public async save(settings: ISettingsStore) {
    try {
      const doc = await localDB.get<ISettingsStorage>(this.documentId);
      await localDB.put({ ...doc, ...settings });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      await localDB.put<ISettingsStorage>({
        _id: this.documentId,
        ...settings
      });
    }
  }
}
