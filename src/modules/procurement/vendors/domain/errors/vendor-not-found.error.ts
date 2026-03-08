import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class VendorNotFoundError extends NotFoundError {
  constructor() {
    super('Vendor not found', 'VENDOR_NOT_FOUND');
  }
}
