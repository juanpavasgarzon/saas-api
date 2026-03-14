import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IProjectRepository } from '../../../domain/contracts/workspace-repository.contract';
import { Project } from '../../../domain/entities/workspace.entity';
import { ProjectNotFoundError } from '../../../domain/errors/workspace.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { GetProjectQuery } from './get-workspace.query';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery, Project> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(query: GetProjectQuery): Promise<Project> {
    const project = await this.projectRepository.findById(query.projectId, query.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(query.projectId);
    }

    return project;
  }
}
