import { ConflictError } from '@shared/domain/errors/conflict.error';

import { type PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

export class PurchaseOrderInvalidTransitionError extends ConflictError {
  constructor(from: PurchaseOrderStatus, to: string) {
    super(`Cannot transition purchase order from ${from} to ${to}`);
  }
}
