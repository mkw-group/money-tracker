import React from 'react';
import { configure, observable } from 'mobx';
import { SettingsStore, WizardUiStore } from 'features/settings';
import { SessionStore } from 'features/session';

configure({
  enforceActions: 'observed'
});

class RootEntityStore {
  @observable session: SessionStore;
  @observable settings: SettingsStore;

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
  @observable wizard: WizardUiStore = new WizardUiStore();
}

export class RootStore {
  @observable entity: RootEntityStore;
  @observable ui: RootUiStore;

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
