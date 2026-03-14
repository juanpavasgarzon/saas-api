import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { ProspectNotFoundError } from '../../../domain/errors/prospect-not-found.error';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { DeleteProspectCommand } from './delete-prospect.command';

@CommandHandler(DeleteProspectCommand)
export class DeleteProspectHandler implements ICommandHandler<DeleteProspectCommand, void> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: DeleteProspectCommand): Promise<void> {
    const prospect = await this.prospectRepository.findById(command.id, command.tenantId);
    if (!prospect) {
      throw new ProspectNotFoundError(command.id);
    }

    await this.prospectRepository.delete(command.id, command.tenantId);
  }
}
