import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Prospect } from '../entities/prospect.entity';
import { type SupplierProspectStatus } from '../enums/prospect-status.enum';

export interface IProspectRepository {
  findById(id: string, tenantId: string): Promise<Prospect | null>;
  findAll(
    tenantId: string,
    filters: { status?: SupplierProspectStatus; search?: string },
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Prospect>>;
  save(prospect: Prospect): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
