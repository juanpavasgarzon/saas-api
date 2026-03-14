import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Deal } from '../entities/deal.entity';
import { type SaleFilters } from './deal-filters.contract';

export interface IDealRepository {
  findById(id: string, tenantId: string): Promise<Deal | null>;
  findAll(
    tenantId: string,
    filters: SaleFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Deal>>;
  nextNumber(tenantId: string): Promise<number>;
  save(deal: Deal): Promise<void>;
}
