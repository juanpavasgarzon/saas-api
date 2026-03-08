import { type ICommand } from '@nestjs/cqrs';

import { type TransactionType } from '../../../domain/enums/transaction-type.enum';

export class CreateTransactionCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly description: string,
    public readonly reference: string | null,
    public readonly date: Date | null,
  ) {}
}
