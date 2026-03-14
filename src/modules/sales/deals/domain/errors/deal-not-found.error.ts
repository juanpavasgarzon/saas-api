import { NotFoundError } from '@core/domain/errors/not-found.error';

export class DealNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Deal', id);
  }
}
