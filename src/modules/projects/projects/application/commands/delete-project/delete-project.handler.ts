import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/project.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { DeleteProjectCommand } from './delete-project.command';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
    }

    await this.projectRepository.delete(command.projectId, command.tenantId);
  }
}
