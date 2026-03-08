import { ValidationError } from '@shared/domain/errors/validation.error';

export class InvalidProjectStatusTransitionError extends ValidationError {
  constructor(from: string, to: string) {
    super(`Cannot transition project status from "${from}" to "${to}"`);
  }
}
