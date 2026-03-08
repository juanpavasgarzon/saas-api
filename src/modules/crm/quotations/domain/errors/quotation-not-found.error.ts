import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class QuotationNotFoundError extends NotFoundError {
  constructor() {
    super('Quotation', 'unknown');
  }
}
