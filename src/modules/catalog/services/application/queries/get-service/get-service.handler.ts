import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { Service } from '../../../domain/entities/service.entity';
import { ServiceNotFoundError } from '../../../domain/errors/service-not-found.error';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { GetServiceQuery } from './get-service.query';

@QueryHandler(GetServiceQuery)
export class GetServiceHandler implements IQueryHandler<GetServiceQuery, Service> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(query: GetServiceQuery): Promise<Service> {
    const service = await this.serviceRepository.findById(query.id, query.tenantId);
    if (!service) {
      throw new ServiceNotFoundError(query.id);
    }
    return service;
  }
}
