import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { Workspace } from '../../../domain/entities/workspace.entity';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { GetWorkspaceQuery } from './get-workspace.query';

@QueryHandler(GetWorkspaceQuery)
export class GetWorkspaceHandler implements IQueryHandler<GetWorkspaceQuery, Workspace> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(query: GetWorkspaceQuery): Promise<Workspace> {
    const project = await this.projectRepository.findById(query.projectId, query.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(query.projectId);
    }

    return project;
  }
}
