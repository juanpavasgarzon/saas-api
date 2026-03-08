import { type IQuery } from '@nestjs/cqrs';

import { type TransactionFilters } from '../../../domain/contracts/accounting-repository.contract';

export class ListTransactionsQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: TransactionFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
