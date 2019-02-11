import React from 'react';
import { configure } from 'mobx';
import {
  SettingsStore,
  GroupsStore,
  AccountsStore,
  MoneyStore,
  WizardUiStore
} from 'features/settings';
import { SessionStore } from 'features/session';

configure({
  enforceActions: 'observed'
});

class RootEntityStore {
  session: SessionStore;
  settings: SettingsStore;
  groups: GroupsStore;
  accounts: AccountsStore;
  money: MoneyStore;

  private constructor({
    session,
    settings,
    groups,
    accounts,
    money
  }: RootEntityStore) {
    this.session = session;
    this.settings = settings;
    this.groups = groups;
    this.accounts = accounts;
    this.money = money;
  }

  static async init() {
    const session = SessionStore.getInstance();
    const groups = await GroupsStore.init();
    const accounts = await AccountsStore.init();
    const settings = await SettingsStore.init(groups, accounts);
    const money = await MoneyStore.init();

    return new RootEntityStore({ session, settings, groups, accounts, money });
  }
}

class RootUiStore {
  wizard: WizardUiStore = new WizardUiStore();
}

export class RootStore {
  entity: RootEntityStore;
  ui: RootUiStore;

  constructor({ entity, ui }: RootStore) {
    this.entity = entity;
    this.ui = ui;
  }

  static async init() {
    const entity = await RootEntityStore.init();
    const ui = new RootUiStore();

    return new RootStore({ entity, ui });
  }
}

export const StoreContext = React.createContext({} as RootStore);
