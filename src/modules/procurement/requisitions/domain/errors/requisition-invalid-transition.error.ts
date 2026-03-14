import { ConflictError } from '@core/domain/errors/conflict.error';

import { type RequisitionStatus } from '../enums/requisition-status.enum';

export class RequisitionInvalidTransitionError extends ConflictError {
  constructor(from: RequisitionStatus, to: string) {
    super(`Cannot transition purchase request from ${from} to ${to}`);
  }
}
