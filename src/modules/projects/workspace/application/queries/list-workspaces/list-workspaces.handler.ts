import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { Workspace } from '../../../domain/entities/workspace.entity';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { ListWorkspacesQuery } from './list-workspaces.query';

@QueryHandler(ListWorkspacesQuery)
export class ListWorkspacesHandler implements IQueryHandler<
  ListWorkspacesQuery,
  PaginatedResult<Workspace>
> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(query: ListWorkspacesQuery): Promise<PaginatedResult<Workspace>> {
    return this.projectRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
