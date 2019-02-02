import PouchDB from 'pouchdb';
import { SettingsJsonT } from './SettingsStore';
import { MoneySettingsJsonT } from './MoneySettingsStore';
import { AccountGroupT } from './GroupSettingsStore';

let timestamp = Date.now();
const defaultAccountGroups: AccountGroupT[] = [
  { id: `G${timestamp++}`, name: 'Cash' },
  { id: `G${timestamp++}`, name: 'Bank Account' },
  { id: `G${timestamp++}`, name: 'Credit' },
  { id: `G${timestamp++}`, name: 'Deposit' }
];

const defaultSettings: SettingsJsonT = {
  _id: 'settings',
  isSetupComplete: false,
  money: {
    exchangeRate: { USD: 1 },
    baseCurrency: 'currency.USD',
    assets: [
      {
        id: 'currency.USD',
        kind: 'currency',
        code: 'USD',
        name: 'US Dollar',
        description: 'Currency',
        exp: 2
      }
    ]
  },
  groups: defaultAccountGroups,
  categories: []
};
const SettingsPouchDb = new PouchDB('settings', { auto_compaction: true });

export class SettingsDB {
  static async loadJson(): Promise<SettingsJsonT> {
    try {
      const data = await SettingsPouchDb.get<SettingsJsonT>('settings');

      return data;
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      return defaultSettings;
    }
  }

  static async persistGroupsChange(groups: AccountGroupT[]): Promise<void> {
    const doc = await SettingsDB.loadJson();

    await SettingsPouchDb.put<SettingsJsonT>({ ...doc, groups });
  }

  static async saveSetupComplete(isSetupComplete: boolean): Promise<void> {
    console.log('saving is complete', isSetupComplete);
  }
  static async saveMoneySettings(settings: MoneySettingsJsonT): Promise<void> {
    console.log('saving money', settings);
  }
}
