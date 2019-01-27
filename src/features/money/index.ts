import { CurrencyCode } from './Currency';
import { StockSymbol } from './Stock';

export enum MoneyKind {
  PhysicalCurrency,
  DigitalCurrency,
  Stock
}
export type MoneyCode = CurrencyCode | StockSymbol;

export * from './Currency';
export * from './Stock';
export * from './Asset';
