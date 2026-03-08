import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IPurchaseOrderRepository } from '../../../domain/contracts/purchase-order-repository.contract';
import { PurchaseOrderNotFoundError } from '../../../domain/errors/purchase-order-not-found.error';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/tokens/purchase-order-repository.token';
import { CancelPurchaseOrderCommand } from './cancel-purchase-order.command';

@CommandHandler(CancelPurchaseOrderCommand)
export class CancelPurchaseOrderHandler implements ICommandHandler<
  CancelPurchaseOrderCommand,
  void
> {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
  ) {}

  async execute(command: CancelPurchaseOrderCommand): Promise<void> {
    const po = await this.purchaseOrderRepository.findById(command.id, command.tenantId);
    if (!po) {
      throw new PurchaseOrderNotFoundError();
    }
    po.cancel();
    await this.purchaseOrderRepository.save(po);
  }
}
