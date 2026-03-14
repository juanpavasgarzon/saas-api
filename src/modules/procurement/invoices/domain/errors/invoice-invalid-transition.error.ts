import { ConflictError } from '@core/domain/errors/conflict.error';

export class InvoiceInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition supplier invoice from ${from} to ${to}`);
  }
}
