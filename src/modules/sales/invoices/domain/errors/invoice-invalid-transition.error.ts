import { ConflictError } from '@shared/domain/errors/conflict.error';

export class InvoiceInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition invoice from ${from} to ${to}`);
  }
}
