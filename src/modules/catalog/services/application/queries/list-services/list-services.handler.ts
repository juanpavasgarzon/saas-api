import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IServiceRepository } from '../../../domain/contracts/service-repository.contract';
import { Service } from '../../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../../domain/tokens/service-repository.token';
import { ListServicesQuery } from './list-services.query';

@QueryHandler(ListServicesQuery)
export class ListServicesHandler implements IQueryHandler<
  ListServicesQuery,
  PaginatedResult<Service>
> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(query: ListServicesQuery): Promise<PaginatedResult<Service>> {
    return this.serviceRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
