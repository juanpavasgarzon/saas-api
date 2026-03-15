import { ValidationError } from '@core/domain/errors/validation.error';

export class InvalidWorkspaceStatusTransitionError extends ValidationError {
  constructor(from: string, to: string) {
    super(`Cannot transition workspace status from "${from}" to "${to}"`);
  }
}
