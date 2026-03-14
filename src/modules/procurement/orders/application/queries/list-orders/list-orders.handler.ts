import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IOrderRepository } from '../../../domain/contracts/order-repository.contract';
import { type Order } from '../../../domain/entities/order.entity';
import { ORDER_REPOSITORY } from '../../../domain/tokens/order-repository.token';
import { ListOrdersQuery } from './list-orders.query';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<ListOrdersQuery, PaginatedResult<Order>> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: ListOrdersQuery): Promise<PaginatedResult<Order>> {
    const filters = { status: query.status, supplierId: query.supplierId };
    return this.orderRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
