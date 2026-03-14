import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IOrderRepository } from '../../../domain/contracts/order-repository.contract';
import { OrderNotFoundError } from '../../../domain/errors/order-not-found.error';
import { ORDER_REPOSITORY } from '../../../domain/tokens/order-repository.token';
import { CancelOrderCommand } from './cancel-order.command';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand, void> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const po = await this.orderRepository.findById(command.id, command.tenantId);
    if (!po) {
      throw new OrderNotFoundError(command.id);
    }
    po.cancel();
    await this.orderRepository.save(po);
  }
}
