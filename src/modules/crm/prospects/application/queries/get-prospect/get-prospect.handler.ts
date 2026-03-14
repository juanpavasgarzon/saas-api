import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IProspectRepository } from '../../../domain/contracts/prospect-repository.contract';
import { Prospect } from '../../../domain/entities/prospect.entity';
import { ProspectNotFoundError } from '../../../domain/errors/prospect-not-found.error';
import { PROSPECT_REPOSITORY } from '../../../domain/tokens/prospect-repository.token';
import { GetProspectQuery } from './get-prospect.query';

@QueryHandler(GetProspectQuery)
export class GetProspectHandler implements IQueryHandler<GetProspectQuery, Prospect> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(query: GetProspectQuery): Promise<Prospect> {
    const prospect = await this.prospectRepository.findById(query.id, query.tenantId);
    if (!prospect) {
      throw new ProspectNotFoundError(query.id);
    }
    return prospect;
  }
}
