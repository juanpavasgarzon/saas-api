import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Project } from '../entities/workspace.entity';
import { type ProjectFilters } from './workspace-filters.contract';

export interface IProjectRepository {
  findById(id: string, tenantId: string): Promise<Project | null>;
  findAll(
    tenantId: string,
    filters: ProjectFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Project>>;
  save(project: Project): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
