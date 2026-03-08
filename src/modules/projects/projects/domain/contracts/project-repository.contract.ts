import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Project } from '../entities/project.entity';
import { type ProjectFilters } from './project-filters.contract';

export interface ProjectRepository {
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
