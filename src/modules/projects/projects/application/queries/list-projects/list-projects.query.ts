import { type IQuery } from '@nestjs/cqrs';

import { type ProjectFilters } from '../../../domain/contracts/project-filters.contract';

export class ListProjectsQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: ProjectFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
