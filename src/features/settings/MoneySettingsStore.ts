import { SyntheticEvent } from 'react';
import { CheckboxProps } from 'semantic-ui-react';
import { observable, observe, action, computed, Lambda } from 'mobx';
import { reorder } from 'util/dnd';
import { AssetId, AssetT } from 'features/money';
import { SettingsDB } from './SettingsDB';

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
    // @ts-ignore
    this.assets.remove(asset);
  }

  @action swapAssets(startIndex: number, endIndex: number) {
    this.assets = reorder(this.assets, startIndex, endIndex);
  }

  discard() {
    this.onChangeDisposer();
  }
}
