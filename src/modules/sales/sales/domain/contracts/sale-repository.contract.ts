import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Sale } from '../entities/sale.entity';
import { type SaleFilters } from './sale-filters.contract';

export interface ISaleRepository {
  findById(id: string, tenantId: string): Promise<Sale | null>;
  findAll(
    tenantId: string,
    filters: SaleFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Sale>>;
  nextNumber(tenantId: string): Promise<number>;
  save(sale: Sale): Promise<void>;
}
