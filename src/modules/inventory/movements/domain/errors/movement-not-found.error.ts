import { AppError } from '@shared/domain/app-error.base';

export class MovementNotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'MOVEMENT_NOT_FOUND';

  constructor(id: string) {
    super(`Movement with id "${id}" not found`);
  }
}
