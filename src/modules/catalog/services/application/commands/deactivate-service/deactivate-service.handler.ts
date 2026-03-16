import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { ServiceNotFoundError } from '../../../domain/errors/service-not-found.error';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { DeactivateServiceCommand } from './deactivate-service.command';

@CommandHandler(DeactivateServiceCommand)
export class DeactivateServiceHandler implements ICommandHandler<DeactivateServiceCommand, void> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(command: DeactivateServiceCommand): Promise<void> {
    const service = await this.serviceRepository.findById(command.id, command.tenantId);
    if (!service) {
      throw new ServiceNotFoundError(command.id);
    }

    service.deactivate();
    await this.serviceRepository.save(service);
  }
}
