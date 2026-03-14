import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type IProjectRepository } from '../../../domain/contracts/project-repository.contract';
import { Project } from '../../../domain/entities/project.entity';
import { PROJECT_REPOSITORY } from '../../../domain/tokens/project-repository.token';
import { CreateProjectCommand } from './create-project.command';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand, string> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<string> {
    const project = Project.create(
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
