import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProjectRepository } from '../../../domain/contracts/workspace-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/workspace.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { DeleteProjectCommand } from './delete-workspace.command';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
    }

    await this.projectRepository.delete(command.projectId, command.tenantId);
  }
}
