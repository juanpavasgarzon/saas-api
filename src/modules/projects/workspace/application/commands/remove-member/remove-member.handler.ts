import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { RemoveMemberCommand } from './remove-member.command';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(command.projectId);
    }

    project.removeMember(command.employeeId);
    await this.projectRepository.save(project);
  }
}
