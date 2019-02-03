import fetch from 'isomorphic-fetch';
import { AssetKind, IAsset } from 'features/settings';
import {
  IAssetSearchResponse,
  IAssetSearchResponseItem
} from './AssetSearch.server';

const endpointUrl = process.env.REACT_APP_ASSET_SEARCH_URL;
const descriptionMap: Record<
  AssetKind,
  (item: IAssetSearchResponseItem) => string
> = {
  currency: () => 'Currency',
  crypto: () => 'Crypto',
  security: ({ securityType, securityRegion, securityCurrency }) =>
    `${securityType}, ${securityRegion} (${securityCurrency})`
};

export async function findAssets(query: string = ''): Promise<IAsset[]> {
  try {
    const res = await fetch(`${endpointUrl}?q=${encodeURIComponent(query)}`);
    const body: IAssetSearchResponse = await res.json();
    if (!body.ok) throw new Error(`Response was not ok: ${body}`);

    return body.results.map((item) => ({
      id: `${item.kind}.${item.code}`,
      ...item,
      description: descriptionMap[item.kind](item)
    }));
  } catch (e) {
    console.error(e);

    return [];
  }
}
