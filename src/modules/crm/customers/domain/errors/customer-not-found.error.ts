import { NotFoundError } from '@core/domain/errors/not-found.error';

export class CustomerNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Customer', id);
  }
}
