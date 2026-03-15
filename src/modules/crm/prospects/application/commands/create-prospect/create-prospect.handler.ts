import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { Prospect } from '../../../domain/entities/prospect.entity';
import { ProspectEmailAlreadyExistsError } from '../../../domain/errors/prospect-email-already-exists.error';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { CreateProspectCommand } from './create-prospect.command';

@CommandHandler(CreateProspectCommand)
export class CreateProspectHandler implements ICommandHandler<CreateProspectCommand, string> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<string> {
    const exists = await this.prospectRepository.findByEmail(command.email, command.tenantId);
    if (exists) {
      throw new ProspectEmailAlreadyExistsError(command.email);
    }

    const prospect = Prospect.create(
      command.tenantId,
      command.name,
      command.email,
      command.phone,
      command.company,
      command.identificationNumber,
      command.address,
      command.contactPerson,
      command.source,
      command.notes,
    );
    await this.prospectRepository.save(prospect);
    return prospect.id;
  }
}
