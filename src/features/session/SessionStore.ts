import { SyntheticEvent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { observable, action, computed } from 'mobx';
import { addLocale, useLocale } from 'ttag';
import { StorageCredentials } from 'features/storage';

export enum SessionMode {
  Unknown,
  Guest,
  Demo,
  Live
}

interface SessionT {
  mode: SessionMode;
  authToken?: string;
  credentials?: StorageCredentials;
}

export class SessionStore {
  @observable mode: SessionMode;
  @observable locale: string = SessionStore.getUserLocale();
  @observable authToken?: string;
  @observable credentials?: StorageCredentials;

  constructor({ mode, authToken, credentials }: SessionT) {
    this.mode = mode;
    this.authToken = authToken;
    this.credentials = credentials;
  }

  static init(): SessionStore {
    const data = localStorage.getItem('userInfo');
    if (data) {
      const session: SessionT = JSON.parse(data);

      return new SessionStore(session);
    } else {
      return new SessionStore({ mode: SessionMode.Unknown });
    }
  }

  static getUserLocale(): string {
    return localStorage.getItem('userLocale') || 'en';
  }

  static loadLocale(): void {
    const locale = SessionStore.getUserLocale();
    const translationsObj = require(`../../../i18n/${locale}.po.json`);
    addLocale(locale, translationsObj);
    useLocale(locale);
  }

  @action.bound changeLocale(_: SyntheticEvent, { value }: DropdownProps) {
    const locale = String(value);
    if (locale !== this.locale) {
      this.locale = locale;
      localStorage.setItem('userLocale', locale);
      window.location.reload();
    }
  }

  @action.bound switchToGuest() {
    this.mode = SessionMode.Guest;
  }

  @computed get isUnknown(): boolean {
    return this.mode === SessionMode.Unknown;
  }
}
