import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IOrderRepository } from '../../../domain/contracts/order-repository.contract';
import { OrderNotFoundError } from '../../../domain/errors/order-not-found.error';
import { ORDER_REPOSITORY } from '../../../domain/tokens/order-repository.token';
import { ReceiveOrderCommand } from './receive-order.command';

@CommandHandler(ReceiveOrderCommand)
export class ReceiveOrderHandler implements ICommandHandler<ReceiveOrderCommand, void> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ReceiveOrderCommand): Promise<void> {
    const po = await this.orderRepository.findById(command.id, command.tenantId);
    if (!po) {
      throw new OrderNotFoundError(command.id);
    }

    this.publisher.mergeObjectContext(po);
    po.receive();
    await this.orderRepository.save(po);
    po.commit();
  }
}
