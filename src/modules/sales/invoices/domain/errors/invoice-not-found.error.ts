import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class InvoiceNotFoundError extends NotFoundError {
  constructor() {
    super('Invoice', 'unknown');
  }
}
