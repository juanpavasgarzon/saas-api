import { AppError } from '../app-error.base';

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly errorCode = 'FORBIDDEN';

  constructor(message = 'Forbidden') {
    super(message);
  }
}
