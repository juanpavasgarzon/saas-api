import { NotFoundError } from '@core/domain/errors/not-found.error';

export class ProspectNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Prospect not found', id);
  }
}
