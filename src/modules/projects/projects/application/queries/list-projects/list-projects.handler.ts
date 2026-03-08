import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type ProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { Project } from '../../../domain/entities/project.entity';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { ListProjectsQuery } from './list-projects.query';

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<
  ListProjectsQuery,
  PaginatedResult<Project>
> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(query: ListProjectsQuery): Promise<PaginatedResult<Project>> {
    return this.projectRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
