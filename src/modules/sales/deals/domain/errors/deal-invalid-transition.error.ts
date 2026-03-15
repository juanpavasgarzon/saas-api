import { ConflictError } from '@core/domain/errors/conflict.error';

export class DealInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition deal from ${from} to ${to}`);
  }
}
