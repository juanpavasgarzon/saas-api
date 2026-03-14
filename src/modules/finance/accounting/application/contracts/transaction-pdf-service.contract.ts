import { type AccountingTransaction } from '../../domain/entities/accounting-transaction.entity';

export interface ITransactionPdfService {
  generate(transaction: AccountingTransaction, companyName: string): Promise<Buffer>;
}
