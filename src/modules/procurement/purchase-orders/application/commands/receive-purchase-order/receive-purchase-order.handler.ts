import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseOrderRepository } from '../../../domain/contracts/purchase-order-repository.contract';
import { PurchaseOrderNotFoundError } from '../../../domain/errors/purchase-order-not-found.error';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/tokens/purchase-order-repository.token';
import { ReceivePurchaseOrderCommand } from './receive-purchase-order.command';

@CommandHandler(ReceivePurchaseOrderCommand)
export class ReceivePurchaseOrderHandler implements ICommandHandler<
  ReceivePurchaseOrderCommand,
  void
> {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ReceivePurchaseOrderCommand): Promise<void> {
    const po = await this.purchaseOrderRepository.findById(command.id, command.tenantId);
    if (!po) {
      throw new PurchaseOrderNotFoundError();
    }
    this.publisher.mergeObjectContext(po);
    po.receive();
    await this.purchaseOrderRepository.save(po);
    po.commit();
  }
}
