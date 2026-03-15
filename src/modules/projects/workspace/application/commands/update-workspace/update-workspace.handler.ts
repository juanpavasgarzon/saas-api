import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { UpdateWorkspaceCommand } from './update-workspace.command';

@CommandHandler(UpdateWorkspaceCommand)
export class UpdateWorkspaceHandler implements ICommandHandler<UpdateWorkspaceCommand> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: UpdateWorkspaceCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(command.projectId);
    }

    project.update(
      command.name,
      command.description,
      command.budget,
      command.startDate,
      command.endDate,
    );

    if (command.members !== null) {
      const desired = command.members;
      const current = project.members;

      // Remove members not in desired list
      for (const existing of current) {
        if (!desired.some((m) => m.employeeId === existing.employeeId)) {
          project.removeMember(existing.employeeId);
        }
      }

      // Add members not in current list
      for (const m of desired) {
        if (!project.hasMember(m.employeeId)) {
          project.addMember(m.employeeId, m.role);
        }
      }
    }

    await this.projectRepository.save(project);
  }
}
