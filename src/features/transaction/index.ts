import { AssetId } from 'features/settings';

enum TransactionKind {
  Expense,
  Transfer,
  Income
}

interface RegularTransactionT {
  id: string;
  kind: TransactionKind.Expense | TransactionKind.Income;
  date: number;
  note?: string;
  categoryId: string;
  accountId: string;
  assetId: AssetId;
  amount: number;
}

interface TransferTransactionT {
  id: string;
  kind: TransactionKind.Transfer;
  date: number;
  note?: string;
  accountId: string;
  assetId: AssetId;
  amount: number;
  linkedAccountId: string;
  linkedAssetId: AssetId;
  linkedAmount: number;
}

type TransactionT = RegularTransactionT | TransferTransactionT;
