import EventEmitter from 'events';
import { AssetId } from './MoneyStore';
import { action, computed, observable, IObservableArray } from 'mobx';
import { createViewModel, IViewModel } from 'mobx-utils';
import { reorder } from 'util/dnd';
import { AccountsStorage } from 'features/storage';
import { GroupId } from './GroupsStore';

// Account id follows pattern `A${timestamp}`
export type AccountId = string;
export interface IAccount {
  id: AccountId;
  name: string;
  balance: Record<AssetId, number>;
  assets: AssetId[];
}

export class Account {
  public id: AccountId;
  @observable name: string;
  @observable balance: Record<AssetId, number>;
  assets: IObservableArray<AssetId>;

  constructor({ id, name, balance, assets }: IAccount) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.assets = observable(assets);
  }

  @action addAsset(asset: AssetId) {
    this.assets.push(asset);
  }

  @action moveAsset(startIndex: number, endIndex: number) {
    this.assets.replace(reorder(this.assets, startIndex, endIndex));
  }

  @action removeAsset(asset: AssetId) {
    this.assets.remove(asset);
  }

  public toJs(): IAccount {
    const { id, name, assets, balance } = this;

    return { id, name, assets, balance };
  }
}

export class AccountsStore {
  @observable form?: Account & IViewModel<Account> & { isNew?: boolean };
  private afterFormSubmit?: (account: Account) => void;
  private afterFormClose?: (account: Account) => void;
  private accounts: IObservableArray<Account>;
  private events: EventEmitter = new EventEmitter();

  constructor(accounts: IAccount[], private storage: AccountsStorage) {
    this.accounts = observable(accounts.map((account) => new Account(account)));
  }

  public static async init(): Promise<AccountsStore> {
    const storage = new AccountsStorage();
    const accounts = await storage.loadAll();

    return new AccountsStore(accounts, storage);
  }

  @action openNewForm(groupId: GroupId) {
    const account = new Account({
      id: `A${Date.now()}`,
      name: '',
      assets: [],
      balance: {}
    });

    this.form = createViewModel(account);
    this.form.isNew = true;
    this.afterFormSubmit = (account) => {
      this.accounts.push(account);
      this.events.emit('add_to_group', account, groupId);
    };
  }

  @action openEditForm(account: Account) {
    this.form = createViewModel(account);
    this.form.isNew = false;

    // revert any assets changes if form was closed without submit
    const originalAssets = [...account.assets];
    this.afterFormClose = (model) => {
      model.assets.replace(originalAssets);
    };
  }

  @action.bound async submitForm() {
    if (!this.form || this.form.assets.length === 0) return;

    this.form.submit();
    if (this.afterFormSubmit) this.afterFormSubmit(this.form.model);
    const data = this.form.model.toJs();
    this.clearForm();

    await this.storage.save(data);
  }

  @action.bound closeForm() {
    if (!this.form) return;

    this.form.reset();
    if (this.afterFormClose) this.afterFormClose(this.form.model);

    this.clearForm();
  }

  @action async remove(id: AccountId) {
    const account = this.findById(id);
    this.events.emit('remove', account);

    await this.storage.remove(account.toJs());
  }

  @computed get length() {
    return this.accounts.length;
  }

  public onRemoved(listener: (account: Account) => void) {
    this.events.addListener('remove', listener);
  }

  public onAddedToGroup(
    listener: (account: Account, groupId: GroupId) => void
  ) {
    this.events.addListener('add_to_group', listener);
  }

  public findById(id: AccountId): Account {
    const account = this.accounts.find((item) => item.id === id);
    if (!account) {
      throw new Error(`Account #${id} not found!`);
    }

    return account;
  }

  public map<U>(
    callback: (value: Account, index: number, array: Account[]) => U,
    thisArg?: any
  ): U[] {
    return this.accounts.map(callback, thisArg);
  }

  private clearForm() {
    this.form = undefined;
    this.afterFormSubmit = undefined;
    this.afterFormClose = undefined;
  }
}
