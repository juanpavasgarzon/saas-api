import { AppError } from '../app-error.base';

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly errorCode = 'UNAUTHORIZED';

  constructor(message = 'Unauthorized') {
    super(message);
  }
}
