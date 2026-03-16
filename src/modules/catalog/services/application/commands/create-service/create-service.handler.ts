import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { Service } from '../../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { CreateServiceCommand } from './create-service.command';

@CommandHandler(CreateServiceCommand)
export class CreateServiceHandler implements ICommandHandler<CreateServiceCommand, string> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(command: CreateServiceCommand): Promise<string> {
    const service = Service.create(
      command.tenantId,
      command.name,
      command.description,
      command.unit,
      command.category,
    );
    await this.serviceRepository.save(service);
    return service.id;
  }
}
