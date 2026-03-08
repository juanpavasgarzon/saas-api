import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class PurchaseRequestNotFoundError extends NotFoundError {
  constructor() {
    super('Purchase request not found', 'PURCHASE_REQUEST_NOT_FOUND');
  }
}
