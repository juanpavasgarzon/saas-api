import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { IAccountingRepository } from '../../../domain/contracts/accounting-repository.contract';
import { AccountingTransaction } from '../../../domain/entities/accounting-transaction.entity';
import { ACCOUNTING_REPOSITORY } from '../../../domain/tokens/accounting-repository.token';
import { ListTransactionsQuery } from './list-transactions.query';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsHandler implements IQueryHandler<
  ListTransactionsQuery,
  PaginatedResult<AccountingTransaction>
> {
  constructor(
    @Inject(ACCOUNTING_REPOSITORY)
    private readonly accountingRepository: IAccountingRepository,
  ) {}

  async execute(query: ListTransactionsQuery): Promise<PaginatedResult<AccountingTransaction>> {
    return this.accountingRepository.findAll(
      query.tenantId,
      query.filters,
      query.page,
      query.limit,
    );
  }
}
