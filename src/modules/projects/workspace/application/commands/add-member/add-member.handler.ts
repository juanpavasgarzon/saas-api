import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWorkspaceRepository } from '../../../domain/contracts/workspace-repository.contract';
import { WorkspaceNotFoundError } from '../../../domain/errors/workspace.errors';
import { WORKSPACE_REPOSITORY } from '../../../domain/tokens/workspace-repository.token';
import { AddMemberCommand } from './add-member.command';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand, string> {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly projectRepository: IWorkspaceRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<string> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new WorkspaceNotFoundError(command.projectId);
    }

    const member = project.addMember(command.employeeId, command.role);
    await this.projectRepository.save(project);

    return member.id;
  }
}
