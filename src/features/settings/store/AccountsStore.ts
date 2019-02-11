import EventEmitter from 'events';
import { AssetId } from './MoneyStore';
import { observable, action, IObservableArray } from 'mobx';
import { AccountsStorage } from 'features/storage';
import { GroupId } from './GroupsStore';

// Account ids follow pattern `A${timestamp}`
export type AccountId = string;
export interface IAccount {
  id: AccountId;
  name: string;
  assets: AssetId[];
  balance: Record<AssetId, number>;
}

class Account {
  public id: AccountId;
  @observable name: string;
  @observable assets: AssetId[];
  @observable balance: Record<AssetId, number>;

  constructor({ id, name, assets, balance }: IAccount) {
    this.id = id;
    this.name = name;
    this.assets = assets;
    this.balance = balance;
  }

  public toJs(): IAccount {
    const { id, name, assets, balance } = this;

    return { id, name, assets, balance };
  }
}

export class AccountsStore {
  public form: Form = new Form();
  private accounts: IObservableArray<Account>;
  private eventManager: EventEmitter = new EventEmitter();

  constructor(accounts: IAccount[], private storage: AccountsStorage) {
    this.accounts = observable(
      accounts.map((account) => {
        return new Account(account);
      })
    );
  }

  public static async init(): Promise<AccountsStore> {
    const storage = new AccountsStorage();
    const accounts = await storage.loadAll();

    return new AccountsStore(accounts, storage);
  }

  @action add(groupId: GroupId) {
    const account = new Account({
      id: `A${Date.now()}`,
      name: 'New Account',
      assets: [],
      balance: {}
    });

    this.accounts.push(account);
    this.eventManager.emit('add', account, groupId);
    this.form.openEditForm(account);
  }

  @action async save(account: Account) {
    await this.storage.save(account.toJs());
  }

  on(event: string, listener: (account: Account, groupId: GroupId) => void) {
    this.eventManager.addListener(event, listener);
  }

  map<U>(
    callback: (value: Account, index: number, array: Account[]) => U,
    thisArg?: any
  ): U[] {
    return this.accounts.map(callback, thisArg);
  }
}

class Form {
  @observable id?: AccountId;
  @observable name?: string;

  @action openEditForm(account: IAccount) {
    this.id = account.id;
    this.name = account.name;
  }
}
