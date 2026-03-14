import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Quotation } from '../entities/quotation.entity';
import { type QuotationFilters } from './quotation-filters.contract';

export interface IQuotationRepository {
  findById(id: string, tenantId: string): Promise<Quotation | null>;
  findAll(
    tenantId: string,
    filters: QuotationFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Quotation>>;
  nextNumber(tenantId: string): Promise<number>;
  save(quotation: Quotation): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
