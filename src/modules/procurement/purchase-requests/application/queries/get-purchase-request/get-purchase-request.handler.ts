import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { type PurchaseRequest } from '../../../domain/entities/purchase-request.entity';
import { PurchaseRequestNotFoundError } from '../../../domain/errors/purchase-request-not-found.error';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { GetPurchaseRequestQuery } from './get-purchase-request.query';

@QueryHandler(GetPurchaseRequestQuery)
export class GetPurchaseRequestHandler implements IQueryHandler<
  GetPurchaseRequestQuery,
  PurchaseRequest
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
  ) {}

  async execute(query: GetPurchaseRequestQuery): Promise<PurchaseRequest> {
    const pr = await this.purchaseRequestRepository.findById(query.id, query.tenantId);
    if (!pr) {
      throw new PurchaseRequestNotFoundError();
    }
    return pr;
  }
}
