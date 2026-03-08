import { type TransactionType } from '../enums/transaction-type.enum';

export interface AccountingTransactionProps {
  id: string;
  tenantId: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
