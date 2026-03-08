import { ConflictError } from '@shared/domain/errors/conflict.error';

export class EmployeeEmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Employee with email "${email}" already exists`);
  }
}
