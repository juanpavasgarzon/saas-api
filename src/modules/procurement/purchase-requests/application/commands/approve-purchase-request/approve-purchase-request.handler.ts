import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { PurchaseRequestNotFoundError } from '../../../domain/errors/purchase-request-not-found.error';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { ApprovePurchaseRequestCommand } from './approve-purchase-request.command';

@CommandHandler(ApprovePurchaseRequestCommand)
export class ApprovePurchaseRequestHandler implements ICommandHandler<
  ApprovePurchaseRequestCommand,
  void
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ApprovePurchaseRequestCommand): Promise<void> {
    const purchaseRequest = await this.purchaseRequestRepository.findById(
      command.id,
      command.tenantId,
    );
    if (!purchaseRequest) {
      throw new PurchaseRequestNotFoundError();
    }
    this.publisher.mergeObjectContext(purchaseRequest);
    purchaseRequest.approve();
    await this.purchaseRequestRepository.save(purchaseRequest);
    purchaseRequest.commit();
  }
}
