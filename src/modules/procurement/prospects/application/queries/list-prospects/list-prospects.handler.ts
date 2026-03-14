import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { Prospect } from '@modules/procurement/prospects/domain/entities/prospect.entity';
import { PROSPECT_REPOSITORY } from '@modules/procurement/prospects/domain/tokens/prospect-repository.token';

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
