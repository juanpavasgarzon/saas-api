import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { PurchaseRequestNotFoundError } from '../../../domain/errors/purchase-request-not-found.error';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { SubmitPurchaseRequestCommand } from './submit-purchase-request.command';

@CommandHandler(SubmitPurchaseRequestCommand)
export class SubmitPurchaseRequestHandler implements ICommandHandler<
  SubmitPurchaseRequestCommand,
  void
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
  ) {}

  async execute(command: SubmitPurchaseRequestCommand): Promise<void> {
    const purchaseRequest = await this.purchaseRequestRepository.findById(
      command.id,
      command.tenantId,
    );
    if (!purchaseRequest) {
      throw new PurchaseRequestNotFoundError();
    }
    purchaseRequest.submit();
    await this.purchaseRequestRepository.save(purchaseRequest);
  }
}
