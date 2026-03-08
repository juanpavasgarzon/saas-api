import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { type Prospect } from '../../../domain/entities/prospect.entity';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { ListProspectsQuery } from './list-prospects.query';

@QueryHandler(ListProspectsQuery)
export class ListProspectsHandler implements IQueryHandler<
  ListProspectsQuery,
  PaginatedResult<Prospect>
> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(query: ListProspectsQuery): Promise<PaginatedResult<Prospect>> {
    return this.prospectRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
