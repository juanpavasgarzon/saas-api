import { AppError } from '@shared/domain/app-error.base';

export class WarehouseNotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'WAREHOUSE_NOT_FOUND';

  constructor(id: string) {
    super(`Warehouse with id "${id}" not found`);
  }
}
