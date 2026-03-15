import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Workspace } from '../entities/workspace.entity';
import { type WorkspaceFilters } from './workspace-filters.contract';

export interface IWorkspaceRepository {
  findById(id: string, tenantId: string): Promise<Workspace | null>;
  findAll(
    tenantId: string,
    filters: WorkspaceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Workspace>>;
  save(project: Workspace): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
