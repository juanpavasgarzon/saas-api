import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Invoice } from '../entities/invoice.entity';
import { type InvoiceFilters } from './invoice-filters.contract';

export interface IInvoiceRepository {
  findById(id: string, tenantId: string): Promise<Invoice | null>;
  findAll(
    tenantId: string,
    filters: InvoiceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Invoice>>;
  nextNumber(tenantId: string): Promise<number>;
  save(invoice: Invoice): Promise<void>;
}
