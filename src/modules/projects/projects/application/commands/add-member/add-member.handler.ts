import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { ProjectNotFoundError } from '../../../domain/errors/project.errors';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { AddMemberCommand } from './add-member.command';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand, string> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<string> {
    const project = await this.projectRepository.findById(command.projectId, command.tenantId);
    if (!project) {
      throw new ProjectNotFoundError(command.projectId);
    }

    const member = project.addMember(command.employeeId, command.role);
    await this.projectRepository.save(project);

    return member.id;
  }
}
