import { type PurchaseRequestStatus } from '../enums/purchase-request-status.enum';

export interface PurchaseRequestFilters {
  status?: PurchaseRequestStatus;
  vendorId?: string;
}
