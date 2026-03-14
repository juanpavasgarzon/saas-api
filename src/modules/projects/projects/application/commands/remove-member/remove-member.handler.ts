import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/project.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { RemoveMemberCommand } from './remove-member.command';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
    }

    project.removeMember(command.employeeId);
    await this.projectRepository.save(project);
  }
}
