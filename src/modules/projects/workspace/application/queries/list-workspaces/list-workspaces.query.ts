import { type IQuery } from '@nestjs/cqrs';

import { type WorkspaceFilters } from '../../../domain/contracts/workspace-filters.contract';

export class ListWorkspacesQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: WorkspaceFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
