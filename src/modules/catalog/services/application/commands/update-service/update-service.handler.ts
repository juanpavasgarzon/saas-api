import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { ServiceNotFoundError } from '../../../domain/errors/service-not-found.error';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { UpdateServiceCommand } from './update-service.command';

@CommandHandler(UpdateServiceCommand)
export class UpdateServiceHandler implements ICommandHandler<UpdateServiceCommand, void> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(command: UpdateServiceCommand): Promise<void> {
    const service = await this.serviceRepository.findById(command.id, command.tenantId);
    if (!service) {
      throw new ServiceNotFoundError(command.id);
    }

    service.update(command.name, command.description, command.unit, command.category);
    await this.serviceRepository.save(service);
  }
}
