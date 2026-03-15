import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { type Deal } from '../../../domain/entities/deal.entity';
import { DealNotFoundError } from '../../../domain/errors/deal-not-found.error';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { GetDealQuery } from './get-deal.query';

@QueryHandler(GetDealQuery)
export class GetDealHandler implements IQueryHandler<GetDealQuery, Deal> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly dealRepository: IDealRepository,
  ) {}

  async execute(query: GetDealQuery): Promise<Deal> {
    const deal = await this.dealRepository.findById(query.id, query.tenantId);
    if (!deal) {
      throw new DealNotFoundError(query.id);
    }
    return deal;
  }
}
