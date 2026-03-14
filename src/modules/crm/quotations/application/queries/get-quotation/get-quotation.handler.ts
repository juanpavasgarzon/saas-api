import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { type Quotation } from '../../../domain/entities/quotation.entity';
import { QuotationNotFoundError } from '../../../domain/errors/quotation-not-found.error';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { GetQuotationQuery } from './get-quotation.query';

@QueryHandler(GetQuotationQuery)
export class GetQuotationHandler implements IQueryHandler<GetQuotationQuery, Quotation> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async execute(query: GetQuotationQuery): Promise<Quotation> {
    const quotation = await this.quotationRepository.findById(query.id, query.tenantId);
    if (!quotation) {
      throw new QuotationNotFoundError(query.id);
    }
    return quotation;
  }
}
