import { ConflictError } from '@core/domain/errors/conflict.error';

export class CustomerEmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Customer with email "${email}" already exists`);
  }
}
