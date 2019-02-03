export * from './SettingsStorage';

export type StorageName = 'settings' | 'transactions';

export interface StorageCredentials {
  username: string;
  password: string;
  url: Record<StorageName, string>;
}
