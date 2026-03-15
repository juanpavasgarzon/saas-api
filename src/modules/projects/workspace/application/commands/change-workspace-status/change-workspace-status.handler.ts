import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { ChangeWorkspaceStatusCommand } from './change-workspace-status.command';

@CommandHandler(ChangeWorkspaceStatusCommand)
export class ChangeWorkspaceStatusHandler implements ICommandHandler<ChangeWorkspaceStatusCommand> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: ChangeWorkspaceStatusCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(command.projectId);
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
