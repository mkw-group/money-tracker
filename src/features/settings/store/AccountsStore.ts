import { AssetId } from './MoneyStore';
import { IObservableArray, observable, action } from 'mobx';

export interface IAccount {
  id: string;
  groupId: string;
  name: string;
  assets: AssetId[];
  balance: Record<AssetId, number>;
}

class AccountsUI {
  @observable editAccountId?: string;
  @observable editAccountGroupId?: string;
  @observable editAccountName?: string;

  @action openEditForm(account: IAccount) {
    this.editAccountId = account.id;
    this.editAccountGroupId = account.groupId;
    this.editAccountName = account.name;
  }
}

export class AccountsStore {
  accounts: IObservableArray<IAccount>;
  ui: AccountsUI = new AccountsUI();

  constructor(accounts: IAccount[]) {
    this.accounts = observable(accounts);
    this.accounts.observe(async () => {
      console.log('accounts changed', this.accounts);
    });
  }

  @action add(groupId: string) {
    const account = {
      id: `A${Date.now()}`,
      groupId,
      name: 'New Account',
      assets: [],
      balance: {}
    };

    this.accounts.push(account);
    this.ui.openEditForm(account);
  }
}
