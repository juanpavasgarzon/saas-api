import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { Prospect } from '../../../domain/entities/prospect.entity';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { SearchProspectsQuery } from './search-prospects.query';

@QueryHandler(SearchProspectsQuery)
export class SearchCustomersHandler implements IQueryHandler<SearchProspectsQuery, Prospect[]> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(query: SearchProspectsQuery): Promise<Prospect[]> {
    return this.prospectRepository.search(query.tenantId, query.search, query.limit);
  }
}
