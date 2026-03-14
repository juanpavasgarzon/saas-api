import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type OrderFilters } from '../../domain/contracts/order-filters.contract';
import { type OrderItemProps } from '../../domain/contracts/order-item-props.contract';
import { type OrderProps } from '../../domain/contracts/order-props.contract';
import { type IOrderRepository } from '../../domain/contracts/order-repository.contract';
import { Order } from '../../domain/entities/order.entity';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';

@Injectable()
export class OrderTypeOrmRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Order | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: OrderFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Order>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items: items.map((item) => this.toDomain(item)), total, page, limit };
  }

  async save(order: Order): Promise<void> {
    await this.repository.save(this.toOrm(order));
  }

  private toDomain(orm: OrderOrmEntity): Order {
    const items = (orm.items ?? []).map(
      (i): OrderItemProps => ({
        id: i.id,
        orderId: i.orderId,
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
        itemType: i.itemType,
        itemId: i.itemId,
      }),
    );

    const props: OrderProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      requisitionId: orm.requisitionId,
      supplierId: orm.supplierId,
      status: orm.status,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Order.reconstitute(props);
  }

  private toOrm(po: Order): OrderOrmEntity {
    const orm = new OrderOrmEntity();
    orm.id = po.id;
    orm.tenantId = po.tenantId;
    orm.requisitionId = po.requisitionId;
    orm.supplierId = po.supplierId;
    orm.status = po.status;
    orm.subtotal = po.subtotal;
    orm.total = po.total;
    orm.items = po.items.map((item) => {
      const itemOrm = new OrderItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.orderId = item.orderId;
      itemOrm.description = item.description;
      itemOrm.quantity = item.quantity;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.lineTotal = item.lineTotal;
      return itemOrm;
    });
    return orm;
  }
}
