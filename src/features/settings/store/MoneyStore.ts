import { SyntheticEvent } from 'react';
import { CheckboxProps } from 'semantic-ui-react';
import { observable, observe, action, computed } from 'mobx';
import { reorder } from 'util/dnd';
import { AssetId, IAsset } from 'features/money';
import { SettingsStorage } from 'features/settings';

export interface IMoneyStore {
  exchangeRate: Record<AssetId, number>;
  baseCurrency: AssetId;
  assets: IAsset[];
}

export class MoneyStore {
  @observable exchangeRate: Record<AssetId, number>;
  @observable baseCurrency: AssetId;
  @observable assets: IAsset[];

  constructor({ exchangeRate, baseCurrency, assets }: IMoneyStore) {
    this.exchangeRate = exchangeRate;
    this.baseCurrency = baseCurrency;
    this.assets = assets;

    observe(this, async ({ object }) => {
      const { exchangeRate, baseCurrency, assets } = object;
      await SettingsStorage.persistMoney({
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

  @action.bound addAsset(asset: IAsset) {
    if (!this.assetsIdSet.has(asset.id)) {
      this.assets.push(asset);
    }
  }

  @action removeAsset(asset: IAsset) {
    // @ts-ignore
    this.assets.remove(asset);
  }

  @action swapAssets(startIndex: number, endIndex: number) {
    this.assets = reorder(this.assets, startIndex, endIndex);
  }
}
