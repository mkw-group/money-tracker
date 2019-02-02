import React from 'react';
import { configure, observable } from 'mobx';
import { AppShellStore } from 'features/app-shell';
import { WizardUiStore } from 'features/setup';

configure({
  enforceActions: 'observed'
});

class RootUiStore {
  @observable wizard: WizardUiStore = new WizardUiStore();
}

export class RootStore {
  @observable appShell: AppShellStore;
  @observable ui: RootUiStore;

  constructor({ appShell, ui }: RootStore) {
    this.appShell = appShell;
    this.ui = ui;
  }

  static async init() {
    const appShell = await AppShellStore.init();
    const ui = new RootUiStore();

    return new RootStore({ appShell, ui });
  }
}

export const StoreContext = React.createContext({} as RootStore);
