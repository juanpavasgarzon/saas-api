import { NotFoundError } from '@core/domain/errors/not-found.error';

export class InvoiceNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Invoice', id);
  }
}
