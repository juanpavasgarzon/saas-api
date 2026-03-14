import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IProjectRepository } from '../../../domain/contracts/workspace-repository.contract';
import { Project } from '../../../domain/entities/workspace.entity';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { ListProjectsQuery } from './list-workspaces.query';

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<
  ListProjectsQuery,
  PaginatedResult<Project>
> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(query: ListProjectsQuery): Promise<PaginatedResult<Project>> {
    return this.projectRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
