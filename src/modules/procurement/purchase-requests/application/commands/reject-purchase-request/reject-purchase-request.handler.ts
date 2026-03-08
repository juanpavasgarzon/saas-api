import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { PurchaseRequestNotFoundError } from '../../../domain/errors/purchase-request-not-found.error';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { RejectPurchaseRequestCommand } from './reject-purchase-request.command';

@CommandHandler(RejectPurchaseRequestCommand)
export class RejectPurchaseRequestHandler implements ICommandHandler<
  RejectPurchaseRequestCommand,
  void
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
  ) {}

  async execute(command: RejectPurchaseRequestCommand): Promise<void> {
    const purchaseRequest = await this.purchaseRequestRepository.findById(
      command.id,
      command.tenantId,
    );
    if (!purchaseRequest) {
      throw new PurchaseRequestNotFoundError();
    }
    purchaseRequest.reject();
    await this.purchaseRequestRepository.save(purchaseRequest);
  }
}
