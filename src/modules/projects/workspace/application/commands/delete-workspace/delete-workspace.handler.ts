import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { DeleteWorkspaceCommand } from './delete-workspace.command';

@CommandHandler(DeleteWorkspaceCommand)
export class DeleteWorkspaceHandler implements ICommandHandler<DeleteWorkspaceCommand> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: DeleteWorkspaceCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(command.projectId);
    }

    await this.projectRepository.delete(command.projectId, command.tenantId);
  }
}
