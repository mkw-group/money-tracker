import { observable, observe, action, IObservableArray } from 'mobx';
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
  @observable accounts: Record<GroupId, IObservableArray<AccountId>>;
  public groups: IObservableArray<GroupId>;

  constructor(
    { isSetupComplete, groups, accounts }: ISettingsStore,
    groupsStore: GroupsStore,
    accountStore: AccountsStore,
    private storage: SettingsStorage
  ) {
    this.isSetupComplete = isSetupComplete;
    this.groups = observable(groups);
    this.accounts = Object.entries(accounts).reduce(
      (acc, [groupId, groupAccounts]) => {
        acc[groupId] = observable(groupAccounts);
        return acc;
      },
      {} as Record<GroupId, IObservableArray<AccountId>>
    );

    groupsStore.on('add', ({ id }) => {
      this.groups.unshift(id);
      this.accounts[id] = observable([]);
    });
    groupsStore.on('remove', ({ id }) => {
      this.groups.remove(id);
      delete this.accounts[id];
    });
    accountStore.on('add', ({ id }, groupId) => {
      this.accounts[groupId].unshift(id);
    });

    this.groups.observe(() => this.persist());
    observe(this, () => this.persist());
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

  @action moveGroup(startIndex: number, endIndex: number) {
    this.groups.replace(reorder(this.groups, startIndex, endIndex));
  }

  @action async moveAccount(
    accountId: AccountId,
    startGroupId: GroupId,
    endGroupId: GroupId,
    startIndex: number,
    endIndex: number
  ) {
    if (startGroupId === endGroupId) {
      this.accounts[startGroupId].replace(
        reorder(this.accounts[startGroupId], startIndex, endIndex)
      );
    } else {
      this.accounts[startGroupId].remove(accountId);
      this.accounts[endGroupId].splice(endIndex, 0, accountId);
    }
  }

  @action.bound completeSetup() {
    this.isSetupComplete = true;
  }

  private async persist() {
    const { isSetupComplete, groups, accounts } = this;
    this.storage.save({ isSetupComplete, groups, accounts });
  }
}
