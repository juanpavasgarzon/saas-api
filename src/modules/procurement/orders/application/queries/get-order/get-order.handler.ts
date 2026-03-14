import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IOrderRepository } from '../../../domain/contracts/order-repository.contract';
import { type Order } from '../../../domain/entities/order.entity';
import { OrderNotFoundError } from '../../../domain/errors/order-not-found.error';
import { ORDER_REPOSITORY } from '../../../domain/tokens/order-repository.token';
import { GetOrderQuery } from './get-order.query';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const po = await this.orderRepository.findById(query.id, query.tenantId);
    if (!po) {
      throw new OrderNotFoundError(query.id);
    }

    return po;
  }
}
