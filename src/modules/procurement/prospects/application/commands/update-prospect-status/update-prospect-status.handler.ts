import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { ProspectNotFoundError } from '@modules/procurement/prospects/domain/errors/prospect-not-found.error';
import { PROSPECT_REPOSITORY } from '@modules/procurement/prospects/domain/tokens/prospect-repository.token';

import { UpdateProspectStatusCommand } from './update-prospect-status.command';

@CommandHandler(UpdateProspectStatusCommand)
export class UpdateProspectStatusHandler implements ICommandHandler<
  UpdateProspectStatusCommand,
  void
> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: UpdateProspectStatusCommand): Promise<void> {
    const prospect = await this.prospectRepository.findById(command.id, command.tenantId);
    if (!prospect) {
      throw new ProspectNotFoundError();
    }

    prospect.updateStatus(command.status);
    await this.prospectRepository.save(prospect);
  }
}
