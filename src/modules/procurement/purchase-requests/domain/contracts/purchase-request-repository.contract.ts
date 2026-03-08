import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type PurchaseRequest } from '../entities/purchase-request.entity';
import { type PurchaseRequestFilters } from './purchase-request-filters.contract';

export interface IPurchaseRequestRepository {
  findById(id: string, tenantId: string): Promise<PurchaseRequest | null>;
  findAll(
    tenantId: string,
    filters: PurchaseRequestFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PurchaseRequest>>;
  save(purchaseRequest: PurchaseRequest): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
