import { ConflictError } from '@core/domain/errors/conflict.error';

export class CompanySlugTakenError extends ConflictError {
  constructor(slug: string) {
    super(`A company with slug "${slug}" already exists`);
  }
}
