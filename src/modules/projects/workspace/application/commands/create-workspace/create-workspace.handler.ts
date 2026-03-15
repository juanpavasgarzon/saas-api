import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { Workspace } from '../../../domain/entities/workspace.entity';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { CreateWorkspaceCommand } from './create-workspace.command';

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, string> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: CreateWorkspaceCommand): Promise<string> {
    const project = Workspace.create(
      command.tenantId,
      command.name,
      command.description,
      command.customerId,
      command.budget ?? undefined,
      command.startDate ?? undefined,
      command.endDate ?? undefined,
    );

    for (const m of command.members) {
      project.addMember(m.employeeId, m.role);
    }

    await this.projectRepository.save(project);
    return project.id;
  }
}
