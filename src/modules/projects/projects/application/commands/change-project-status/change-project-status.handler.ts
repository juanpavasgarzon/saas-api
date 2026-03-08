import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/project.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { ChangeProjectStatusCommand } from './change-project-status.command';

@CommandHandler(ChangeProjectStatusCommand)
export class ChangeProjectStatusHandler implements ICommandHandler<ChangeProjectStatusCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: ChangeProjectStatusCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
    }

    switch (command.action) {
      case 'activate':
        project.activate();
        break;
      case 'hold':
        project.putOnHold();
        break;
      case 'complete':
        project.complete();
        break;
      case 'cancel':
        project.cancel();
        break;
    }

    await this.projectRepository.save(project);
  }
}
