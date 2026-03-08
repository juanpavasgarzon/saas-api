import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class PurchaseOrderNotFoundError extends NotFoundError {
  constructor() {
    super('Purchase order not found', 'PURCHASE_ORDER_NOT_FOUND');
  }
}
