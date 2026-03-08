import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Prospect } from '../entities/prospect.entity';
import { type ProspectFilters } from './prospect-filters.contract';

export interface IProspectRepository {
  findById(id: string, tenantId: string): Promise<Prospect | null>;
  findAll(
    tenantId: string,
    filters: ProspectFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Prospect>>;
  save(prospect: Prospect): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
