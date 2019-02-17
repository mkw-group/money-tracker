import { SyntheticEvent } from 'react';
import { CheckboxProps } from 'semantic-ui-react';
import { observable, action, computed, IObservableArray } from 'mobx';
import { MoneyStorage } from 'features/storage';

export type AssetKind = 'currency' | 'crypto' | 'security';
export type AssetId = string;

export interface IAsset {
  id: AssetId;
  kind: AssetKind;
  code: string;
  name: string;
  exp: number;
  securityType?: string;
  securityRegion?: string;
  securityCurrency?: string;
  description: string;
}

export interface IMoneyStore {
  exchangeRate: Record<AssetId, number>;
  baseCurrency: AssetId;
  assets: IAsset[];
}

export class MoneyStore {
  @observable exchangeRate: Record<AssetId, number>;
  @observable baseCurrency: AssetId;
  assets: IObservableArray<IAsset>;

  constructor(
    { exchangeRate, baseCurrency, assets }: IMoneyStore,
    private storage: MoneyStorage
  ) {
    this.exchangeRate = exchangeRate;
    this.baseCurrency = baseCurrency;
    this.assets = observable(assets);
    this.assets.observe(() => {
      const { exchangeRate, baseCurrency, assets } = this;
      this.storage.save({ exchangeRate, baseCurrency, assets });
    });
  }

  public static async init(): Promise<MoneyStore> {
    const storage = new MoneyStorage();
    const money = await storage.load();

    return new MoneyStore(money, storage);
  }

  public findAssetById(id: AssetId): IAsset {
    const asset = this.assets.find((item) => item.id === id);
    if (!asset) {
      throw new Error(`Asset ${id} not found!`);
    }

    return asset;
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

  @action addAsset(asset: IAsset) {
    if (!this.assetsIdSet.has(asset.id)) {
      this.assets.push(asset);
    }
  }

  @action removeAsset(asset: IAsset) {
    this.assets.remove(asset);
  }
}
