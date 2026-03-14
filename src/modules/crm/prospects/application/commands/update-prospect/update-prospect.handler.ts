import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { ProspectNotFoundError } from '../../../domain/errors/prospect-not-found.error';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { UpdateProspectCommand } from './update-prospect.command';

@CommandHandler(UpdateProspectCommand)
export class UpdateProspectHandler implements ICommandHandler<UpdateProspectCommand, void> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: UpdateProspectCommand): Promise<void> {
    const prospect = await this.prospectRepository.findById(command.id, command.tenantId);
    if (!prospect) {
      throw new ProspectNotFoundError();
    }

    prospect.update(
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
  }
}
