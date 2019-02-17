import { observable, action, IObservableArray } from 'mobx';
import { SettingsStorage } from 'features/storage';
import { reorder } from 'util/dnd';
import { GroupId, GroupsStore } from './GroupsStore';
import { AccountId, AccountsStore } from './AccountsStore';

export interface ISettingsStore {
  isSetupComplete: boolean;
  groups: GroupId[];
  accounts: Record<GroupId, AccountId[]>;
}

export class SettingsStore {
  @observable isSetupComplete: boolean;
  @observable groupAccounts: Record<GroupId, IObservableArray<AccountId>>;
  public groups: IObservableArray<GroupId>;

  constructor(
    { isSetupComplete, groups, accounts }: ISettingsStore,
    groupsStore: GroupsStore,
    accountStore: AccountsStore,
    private storage: SettingsStorage
  ) {
    this.isSetupComplete = isSetupComplete;
    this.groups = observable(groups);
    this.groupAccounts = Object.entries(accounts).reduce(
      (acc, [groupId, groupAccounts]) => {
        acc[groupId] = observable(groupAccounts);
        return acc;
      },
      {} as Record<GroupId, IObservableArray<AccountId>>
    );

    groupsStore.onAdded(async ({ id }) => {
      this.groups.unshift(id);
      this.groupAccounts[id] = observable([]);
      await this.save();
    });

    groupsStore.onRemoved(async ({ id }) => {
      this.groups.remove(id);
      delete this.groupAccounts[id];
      await this.save();
    });

    accountStore.onAddedToGroup(async ({ id }, groupId) => {
      this.groupAccounts[groupId].unshift(id);
      await this.save();
    });

    accountStore.onRemoved(async ({ id }) => {
      for (const groupId in this.groupAccounts) {
        for (const accountId of this.groupAccounts[groupId]) {
          if (accountId === id) {
            this.groupAccounts[groupId].remove(accountId);
            await this.save();
            return;
          }
        }
      }
    });
  }

  static async init(
    groups: GroupsStore,
    accounts: AccountsStore
  ): Promise<SettingsStore> {
    const defaultGroupIds = groups.map(({ id }) => id);
    const storage = new SettingsStorage(defaultGroupIds);
    const settings = await storage.load();

    return new SettingsStore(settings, groups, accounts, storage);
  }

  @action async moveGroup(startIndex: number, endIndex: number) {
    this.groups.replace(reorder(this.groups, startIndex, endIndex));
    await this.save();
  }

  @action async moveAccount(
    accountId: AccountId,
    startGroupId: GroupId,
    endGroupId: GroupId,
    startIndex: number,
    endIndex: number
  ) {
    if (startGroupId === endGroupId) {
      this.groupAccounts[startGroupId].replace(
        reorder(this.groupAccounts[startGroupId], startIndex, endIndex)
      );
    } else {
      this.groupAccounts[startGroupId].remove(accountId);
      this.groupAccounts[endGroupId].splice(endIndex, 0, accountId);
    }
    await this.save();
  }

  @action.bound async completeSetup() {
    this.isSetupComplete = true;
    await this.save();
  }

  private async save() {
    const { isSetupComplete, groups, groupAccounts: accounts } = this;
    this.storage.save({ isSetupComplete, groups, accounts });
  }
}
