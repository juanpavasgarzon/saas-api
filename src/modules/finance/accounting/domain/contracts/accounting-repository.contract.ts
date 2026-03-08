import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type AccountingTransaction } from '../entities/accounting-transaction.entity';

export interface TransactionFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IAccountingRepository {
  findById(id: string, tenantId: string): Promise<AccountingTransaction | null>;
  findAll(
    tenantId: string,
    filters: TransactionFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<AccountingTransaction>>;
  save(transaction: AccountingTransaction): Promise<void>;
}
