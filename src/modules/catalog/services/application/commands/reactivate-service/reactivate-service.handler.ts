import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { ServiceNotFoundError } from '../../../domain/errors/service-not-found.error';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { ReactivateServiceCommand } from './reactivate-service.command';

@CommandHandler(ReactivateServiceCommand)
export class ReactivateServiceHandler implements ICommandHandler<ReactivateServiceCommand, void> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(command: ReactivateServiceCommand): Promise<void> {
    const service = await this.serviceRepository.findById(command.id, command.tenantId);
    if (!service) {
      throw new ServiceNotFoundError(command.id);
    }

    service.activate();
    await this.serviceRepository.save(service);
  }
}
