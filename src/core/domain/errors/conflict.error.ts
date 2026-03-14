import { AppError } from '../app-error.base';

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly errorCode = 'CONFLICT';

  constructor(message: string) {
    super(message);
  }
}
