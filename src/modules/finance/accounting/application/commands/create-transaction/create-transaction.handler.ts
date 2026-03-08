import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IAccountingRepository } from '../../../domain/contracts/accounting-repository.contract';
import { AccountingTransaction } from '../../../domain/entities/accounting-transaction.entity';
import { ACCOUNTING_REPOSITORY } from '../../../domain/tokens/accounting-repository.token';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand, string> {
  constructor(
    @Inject(ACCOUNTING_REPOSITORY)
    private readonly accountingRepository: IAccountingRepository,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<string> {
    const transaction = AccountingTransaction.create(
      command.tenantId,
      command.type,
      command.amount,
      command.description,
      command.reference,
      command.date ?? undefined,
    );

    await this.accountingRepository.save(transaction);
    return transaction.id;
  }
}
