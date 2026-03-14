import { ConflictError } from '@core/domain/errors/conflict.error';

import { type OrderStatus } from '../enums/order-status.enum';

export class OrderInvalidTransitionError extends ConflictError {
  constructor(from: OrderStatus, to: string) {
    super(`Cannot transition purchase order from ${from} to ${to}`);
  }
}
