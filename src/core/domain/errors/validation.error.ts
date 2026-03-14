import { AppError } from '../app-error.base';

export class ValidationError extends AppError {
  readonly statusCode = 422;
  readonly errorCode = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}
