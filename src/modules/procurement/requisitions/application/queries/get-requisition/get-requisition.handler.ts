import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { type Requisition } from '../../../domain/entities/requisition.entity';
import { RequisitionNotFoundError } from '../../../domain/errors/requisition-not-found.error';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { GetRequisitionQuery } from './get-requisition.query';

@QueryHandler(GetRequisitionQuery)
export class GetRequisitionHandler implements IQueryHandler<GetRequisitionQuery, Requisition> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
  ) {}

  async execute(query: GetRequisitionQuery): Promise<Requisition> {
    const pr = await this.requisitionRepository.findById(query.id, query.tenantId);
    if (!pr) {
      throw new RequisitionNotFoundError(query.id);
    }
    return pr;
  }
}
