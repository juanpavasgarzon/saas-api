import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type ProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../domain/errors/project.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { GetProjectQuery } from './get-project.query';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery, Project> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(query: GetProjectQuery): Promise<Project> {
    const project = await this.projectRepository.findById(query.projectId, query.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(query.projectId);
    }

    return project;
  }
}
