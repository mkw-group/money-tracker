import { SyntheticEvent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { observable, observe, action, computed } from 'mobx';
import { addLocale, useLocale } from 'ttag';

export enum SessionMode {
  Unknown,
  Guest,
  Demo,
  Live
}

interface StorageCredentials {
  username: string;
  password: string;
  url: string;
}

interface ISessionData {
  mode: SessionMode;
  locale: string;
  authToken?: string;
  credentials?: StorageCredentials;
}

export class SessionStore {
  @observable mode: SessionMode;
  @observable locale: string;
  @observable authToken?: string;
  @observable credentials?: StorageCredentials;
  private static instance?: SessionStore;

  private constructor({ mode, locale, authToken, credentials }: ISessionData) {
    this.mode = mode;
    this.locale = locale;
    this.authToken = authToken;
    this.credentials = credentials;

    observe(this, () => {
      console.log('session changed');
      localStorage.setItem('userInfo', this.serialize());
    });
  }

  public static getInstance() {
    if (!SessionStore.instance) {
      const data = localStorage.getItem('userInfo');
      const userInfo: Partial<ISessionData> = data ? JSON.parse(data) : {};

      SessionStore.instance = new SessionStore({
        mode: SessionMode.Unknown,
        locale: 'en',
        ...userInfo
      });
    }

    return SessionStore.instance;
  }

  serialize(): string {
    return JSON.stringify({
      locale: this.locale,
      authToken: this.authToken,
      credentials: this.credentials
    });
  }

  loadLocale(): void {
    const translationsObj = require(`../../../i18n/${this.locale}.po.json`);
    addLocale(this.locale, translationsObj);
    useLocale(this.locale);
  }

  @action.bound changeLocale(
    _: SyntheticEvent,
    { value }: DropdownProps
  ): void {
    const locale = String(value);
    if (locale !== this.locale) {
      this.locale = locale;
      window.location.reload();
    }
  }

  @action.bound switchToGuest(): void {
    this.mode = SessionMode.Guest;
  }

  @computed get isUnknown(): boolean {
    return this.mode === SessionMode.Unknown;
  }
}
