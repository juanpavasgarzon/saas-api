import { ConflictError } from '@shared/domain/errors/conflict.error';

export class UserEmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
  }
}
