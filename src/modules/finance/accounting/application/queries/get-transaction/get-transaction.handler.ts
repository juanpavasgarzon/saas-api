import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IAccountingRepository } from '../../../domain/contracts/accounting-repository.contract';
import { type AccountingTransaction } from '../../../domain/entities/accounting-transaction.entity';
import { AccountingTransactionNotFoundError } from '../../../domain/errors/accounting-transaction-not-found.error';
import { ACCOUNTING_REPOSITORY } from '../../../domain/tokens/accounting-repository.token';
import { GetTransactionQuery } from './get-transaction.query';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<
  GetTransactionQuery,
  AccountingTransaction
> {
  constructor(
    @Inject(ACCOUNTING_REPOSITORY)
    private readonly accountingRepository: IAccountingRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<AccountingTransaction> {
    const transaction = await this.accountingRepository.findById(query.id, query.tenantId);
    if (!transaction) {
      throw new AccountingTransactionNotFoundError(query.id);
    }
    return transaction;
  }
}
