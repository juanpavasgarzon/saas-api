import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Prospect } from '../entities/prospect.entity';
import { type VendorProspectStatus } from '../enums/prospect-status.enum';

export interface IProspectRepository {
  findById(id: string, tenantId: string): Promise<Prospect | null>;
  findAll(
    tenantId: string,
    filters: { status?: VendorProspectStatus; search?: string },
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Prospect>>;
  save(prospect: Prospect): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
