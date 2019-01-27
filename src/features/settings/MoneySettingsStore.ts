import { observable, observe, action, computed, Lambda } from 'mobx';
import { AssetId, AssetT } from 'features/money';
import { SettingsDB } from './SettingsDB';
import { SyntheticEvent } from 'react';
import { CheckboxProps } from 'semantic-ui-react';

export interface MoneySettingsJsonT {
  exchangeRate: Record<AssetId, number>;
  baseCurrency: AssetId;
  assets: AssetT[];
}

export class MoneySettingsStore {
  @observable exchangeRate: Record<AssetId, number>;
  @observable baseCurrency: AssetId;
  @observable assets: AssetT[];
  private onChangeDisposer: Lambda;

  constructor({ exchangeRate, baseCurrency, assets }: MoneySettingsJsonT) {
    this.exchangeRate = exchangeRate;
    this.baseCurrency = baseCurrency;
    this.assets = assets;

    observe(this.assets, async (change) => {
      console.log('asset change', this.assets);
    });

    this.onChangeDisposer = observe(this, async ({ object }) => {
      const { exchangeRate, baseCurrency, assets } = object;
      await SettingsDB.saveMoneySettings({
        exchangeRate,
        baseCurrency,
        assets
      });
    });
  }

  @computed get assetsIdSet(): Set<AssetId> {
    return new Set(this.assets.map(({ id }) => id));
  }

  @action.bound updateBaseCurrency(
    _: SyntheticEvent,
    { value }: CheckboxProps
  ) {
    this.baseCurrency = String(value);
  }

  @action.bound addAsset(asset: AssetT) {
    if (!this.assetsIdSet.has(asset.id)) {
      this.assets.push(asset);
    }
  }

  @action removeAsset(asset: AssetT) {
    console.log('remove', asset);
    // @ts-ignore
    this.assets.remove(asset);
  }

  discard() {
    this.onChangeDisposer();
  }
}
