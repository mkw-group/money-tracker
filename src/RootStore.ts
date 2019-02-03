import React from 'react';
import { configure } from 'mobx';
import { SettingsStore, WizardUiStore } from 'features/settings';
import { SessionStore } from 'features/session';

configure({
  enforceActions: 'observed'
});

class RootEntityStore {
  session: SessionStore;
  settings: SettingsStore;

  private constructor({ session, settings }: RootEntityStore) {
    this.session = session;
    this.settings = settings;
  }

  static async init() {
    const session = SessionStore.init();
    const settings = await SettingsStore.init();

    return new RootEntityStore({ session, settings });
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
