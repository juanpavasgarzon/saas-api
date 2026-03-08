import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class SaleNotFoundError extends NotFoundError {
  constructor() {
    super('Sale', 'unknown');
  }
}
