import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type PurchaseRequestFilters } from '../../domain/contracts/purchase-request-filters.contract';
import { type PurchaseRequestItemProps } from '../../domain/contracts/purchase-request-item-props.contract';
import { type PurchaseRequestProps } from '../../domain/contracts/purchase-request-props.contract';
import { type IPurchaseRequestRepository } from '../../domain/contracts/purchase-request-repository.contract';
import { PurchaseRequest } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestOrmEntity } from '../entities/purchase-request.orm-entity';
import { PurchaseRequestItemOrmEntity } from '../entities/purchase-request-item.orm-entity';

@Injectable()
export class PurchaseRequestTypeOrmRepository implements IPurchaseRequestRepository {
  constructor(
    @InjectRepository(PurchaseRequestOrmEntity)
    private readonly repository: Repository<PurchaseRequestOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<PurchaseRequest | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: PurchaseRequestFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PurchaseRequest>> {
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

  async save(purchaseRequest: PurchaseRequest): Promise<void> {
    await this.repository.save(this.toOrm(purchaseRequest));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: PurchaseRequestOrmEntity): PurchaseRequest {
    const items = (orm.items ?? []).map(
      (i): PurchaseRequestItemProps => ({
        id: i.id,
        purchaseRequestId: i.purchaseRequestId,
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: PurchaseRequestProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      title: orm.title,
      vendorId: orm.vendorId,
      vendorProspectId: orm.vendorProspectId,
      status: orm.status,
      notes: orm.notes,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return PurchaseRequest.reconstitute(props);
  }

  private toOrm(pr: PurchaseRequest): PurchaseRequestOrmEntity {
    const orm = new PurchaseRequestOrmEntity();
    orm.id = pr.id;
    orm.tenantId = pr.tenantId;
    orm.title = pr.title;
    orm.vendorId = pr.vendorId;
    orm.vendorProspectId = pr.vendorProspectId;
    orm.status = pr.status;
    orm.notes = pr.notes;
    orm.subtotal = pr.subtotal;
    orm.total = pr.total;
    orm.items = pr.items.map((item) => {
      const itemOrm = new PurchaseRequestItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.purchaseRequestId = item.purchaseRequestId;
      itemOrm.description = item.description;
      itemOrm.quantity = item.quantity;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.lineTotal = item.lineTotal;
      return itemOrm;
    });
    return orm;
  }
}
