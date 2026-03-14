import { NotFoundError } from '@core/domain/errors/not-found.error';

export class QuotationNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Quotation', id);
  }
}
