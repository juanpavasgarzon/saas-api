import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { Prospect } from '@modules/procurement/prospects/domain/entities/prospect.entity';
import { PROSPECT_REPOSITORY } from '@modules/procurement/prospects/domain/tokens/prospect-repository.token';

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
      command.identificationNumber,
      command.address,
      command.contactPerson,
      command.notes,
    );
    await this.prospectRepository.save(prospect);
    return prospect.id;
  }
}
