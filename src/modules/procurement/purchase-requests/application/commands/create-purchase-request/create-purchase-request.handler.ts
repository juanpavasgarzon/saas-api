import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { PurchaseRequest } from '../../../domain/entities/purchase-request.entity';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { CreatePurchaseRequestCommand } from './create-purchase-request.command';

@CommandHandler(CreatePurchaseRequestCommand)
export class CreatePurchaseRequestHandler implements ICommandHandler<
  CreatePurchaseRequestCommand,
  string
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
  ) {}

  async execute(command: CreatePurchaseRequestCommand): Promise<string> {
    const purchaseRequest = PurchaseRequest.create(
      command.tenantId,
      command.title,
      command.vendorId,
      command.vendorProspectId,
      command.notes,
      command.items,
    );
    await this.purchaseRequestRepository.save(purchaseRequest);
    return purchaseRequest.id;
  }
}
