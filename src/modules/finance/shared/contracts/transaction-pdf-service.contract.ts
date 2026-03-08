import { type AccountingTransaction } from '@modules/finance/accounting/domain/entities/accounting-transaction.entity';

export interface ITransactionPdfService {
  generate(transaction: AccountingTransaction, companyName: string): Promise<Buffer>;
}
