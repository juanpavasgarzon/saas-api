import { ConflictError } from '@shared/domain/errors/conflict.error';

export class SaleInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition sale from ${from} to ${to}`);
  }
}
