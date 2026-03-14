import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Requisition } from '../entities/requisition.entity';
import { type RequisitionFilters } from './requisition-filters.contract';

export interface IRequisitionRepository {
  findById(id: string, tenantId: string): Promise<Requisition | null>;
  findAll(
    tenantId: string,
    filters: RequisitionFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Requisition>>;
  save(requisition: Requisition): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
