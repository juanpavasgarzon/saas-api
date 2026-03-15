import { ConflictError } from '@core/domain/errors/conflict.error';

export class ProspectEmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Prospect with email "${email}" already exists`);
  }
}
