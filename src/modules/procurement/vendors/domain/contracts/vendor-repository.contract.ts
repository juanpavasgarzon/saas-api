import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Vendor } from '../entities/vendor.entity';
import { type VendorFilters } from './vendor-filters.contract';

export interface IVendorRepository {
  findById(id: string, tenantId: string): Promise<Vendor | null>;
  findByEmail(email: string, tenantId: string): Promise<Vendor | null>;
  findAll(
    tenantId: string,
    filters: VendorFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Vendor>>;
  save(vendor: Vendor): Promise<void>;
}
