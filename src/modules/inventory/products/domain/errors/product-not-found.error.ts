import { AppError } from '@shared/domain/app-error.base';

export class ProductNotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'PRODUCT_NOT_FOUND';

  constructor(id: string) {
    super(`Product with id "${id}" not found`);
  }
}
