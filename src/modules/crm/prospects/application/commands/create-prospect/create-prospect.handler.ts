import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { Prospect } from '../../../domain/entities/prospect.entity';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { CreateProspectCommand } from './create-prospect.command';

@CommandHandler(CreateProspectCommand)
export class CreateProspectHandler implements ICommandHandler<CreateProspectCommand, string> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<string> {
    const prospect = Prospect.create(
      command.tenantId,
      command.name,
      command.email,
      command.phone,
      command.company,
      command.source,
      command.notes,
    );
    await this.prospectRepository.save(prospect);
    return prospect.id;
  }
}
