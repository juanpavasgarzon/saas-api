import { ConflictError } from '@core/domain/errors/conflict.error';

export class QuotationInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition quotation from ${from} to ${to}`);
  }
}
