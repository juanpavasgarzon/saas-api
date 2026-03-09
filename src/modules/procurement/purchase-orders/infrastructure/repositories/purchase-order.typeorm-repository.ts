import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type PurchaseOrderFilters } from '../../domain/contracts/purchase-order-filters.contract';
import { type PurchaseOrderItemProps } from '../../domain/contracts/purchase-order-item-props.contract';
import { type PurchaseOrderProps } from '../../domain/contracts/purchase-order-props.contract';
import { type IPurchaseOrderRepository } from '../../domain/contracts/purchase-order-repository.contract';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderOrmEntity } from '../entities/purchase-order.orm-entity';
import { PurchaseOrderItemOrmEntity } from '../entities/purchase-order-item.orm-entity';

@Injectable()
export class PurchaseOrderTypeOrmRepository implements IPurchaseOrderRepository {
  constructor(
    @InjectRepository(PurchaseOrderOrmEntity)
    private readonly repository: Repository<PurchaseOrderOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<PurchaseOrder | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: PurchaseOrderFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PurchaseOrder>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.vendorId) {
      where.vendorId = filters.vendorId;
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items: items.map((item) => this.toDomain(item)), total, page, limit };
  }

  async save(purchaseOrder: PurchaseOrder): Promise<void> {
    await this.repository.save(this.toOrm(purchaseOrder));
  }

  private toDomain(orm: PurchaseOrderOrmEntity): PurchaseOrder {
    const items = (orm.items ?? []).map(
      (i): PurchaseOrderItemProps => ({
        id: i.id,
        purchaseOrderId: i.purchaseOrderId,
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: PurchaseOrderProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      purchaseRequestId: orm.purchaseRequestId,
      vendorId: orm.vendorId,
      status: orm.status,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return PurchaseOrder.reconstitute(props);
  }

  private toOrm(po: PurchaseOrder): PurchaseOrderOrmEntity {
    const orm = new PurchaseOrderOrmEntity();
    orm.id = po.id;
    orm.tenantId = po.tenantId;
    orm.purchaseRequestId = po.purchaseRequestId;
    orm.vendorId = po.vendorId;
    orm.status = po.status;
    orm.subtotal = po.subtotal;
    orm.total = po.total;
    orm.items = po.items.map((item) => {
      const itemOrm = new PurchaseOrderItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.purchaseOrderId = item.purchaseOrderId;
      itemOrm.description = item.description;
      itemOrm.quantity = item.quantity;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.lineTotal = item.lineTotal;
      return itemOrm;
    });
    return orm;
  }
}
