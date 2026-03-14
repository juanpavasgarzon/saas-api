import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Supplier } from '../entities/supplier.entity';
import { type SupplierFilters } from './supplier-filters.contract';

export interface ISupplierRepository {
  findById(id: string, tenantId: string): Promise<Supplier | null>;
  findByEmail(email: string, tenantId: string): Promise<Supplier | null>;
  findAll(
    tenantId: string,
    filters: SupplierFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Supplier>>;
  save(supplier: Supplier): Promise<void>;
}
