import { NotFoundError } from '@core/domain/errors/not-found.error';

export class AccountingTransactionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('AccountingTransaction', id);
  }
}
