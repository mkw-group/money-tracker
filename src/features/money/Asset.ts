export type AssetKind = 'currency' | 'crypto' | 'security';
export type AssetId = string;

export interface AssetSearchResponseT {
  ok: boolean;
  results: AssetSearchResponseItemT[];
}

export interface AssetSearchResponseItemT {
  kind: AssetKind;
  code: string;
  name: string;
  exp: number;
  securityType?: string;
  securityRegion?: string;
  securityCurrency?: string;
}

export interface AssetT extends AssetSearchResponseItemT {
  id: AssetId;
  description: string;
}
