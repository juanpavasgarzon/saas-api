import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type IProjectRepository } from '../../../domain/contracts/workspace-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/workspace.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { UpdateProjectCommand } from './update-workspace.command';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
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
