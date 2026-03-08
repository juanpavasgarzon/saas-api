import { ConflictError } from '@shared/domain/errors/conflict.error';

import { type PurchaseRequestStatus } from '../enums/purchase-request-status.enum';

export class PurchaseRequestInvalidTransitionError extends ConflictError {
  constructor(from: PurchaseRequestStatus, to: string) {
    super(`Cannot transition purchase request from ${from} to ${to}`);
  }
}
