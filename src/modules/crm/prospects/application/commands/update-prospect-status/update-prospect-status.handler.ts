import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { ProspectNotFoundError } from '../../../domain/errors/prospect-not-found.error';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { UpdateProspectStatusCommand } from './update-prospect-status.command';

@CommandHandler(UpdateProspectStatusCommand)
export class UpdateProspectStatusHandler implements ICommandHandler<
  UpdateProspectStatusCommand,
  void
> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateProspectStatusCommand): Promise<void> {
    const prospect = await this.prospectRepository.findById(command.id, command.tenantId);
    if (!prospect) {
      throw new ProspectNotFoundError(command.id);
    }

    this.publisher.mergeObjectContext(prospect);
    prospect.updateStatus(command.status);

    await this.prospectRepository.save(prospect);
    prospect.commit();
  }
}
