import { NotFoundError } from '@core/domain/errors/not-found.error';

export class OrderNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Purchase order', id);
  }
}
