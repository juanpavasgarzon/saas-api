import { AppError } from '../app-error.base';

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'NOT_FOUND';

  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`);
  }
}
