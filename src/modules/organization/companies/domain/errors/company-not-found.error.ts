import { NotFoundError } from '@core/domain/errors/not-found.error';

export class CompanyNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Company', id);
  }
}
