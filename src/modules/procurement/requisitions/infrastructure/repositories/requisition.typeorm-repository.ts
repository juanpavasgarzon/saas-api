import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type RequisitionFilters } from '../../domain/contracts/requisition-filters.contract';
import { type RequisitionItemProps } from '../../domain/contracts/requisition-item-props.contract';
import { type RequisitionProps } from '../../domain/contracts/requisition-props.contract';
import { type IRequisitionRepository } from '../../domain/contracts/requisition-repository.contract';
import { Requisition } from '../../domain/entities/requisition.entity';
import { RequisitionOrmEntity } from '../entities/requisition.orm-entity';
import { RequisitionItemOrmEntity } from '../entities/requisition-item.orm-entity';

@Injectable()
export class RequisitionTypeOrmRepository implements IRequisitionRepository {
  constructor(
    @InjectRepository(RequisitionOrmEntity)
    private readonly repository: Repository<RequisitionOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Requisition | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: RequisitionFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Requisition>> {
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

  async save(requisition: Requisition): Promise<void> {
    await this.repository.save(this.toOrm(requisition));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: RequisitionOrmEntity): Requisition {
    const items = (orm.items ?? []).map(
      (i): RequisitionItemProps => ({
        id: i.id,
        requisitionId: i.requisitionId,
        itemType: i.itemType,
        itemId: i.itemId,
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: RequisitionProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      title: orm.title,
      supplierId: orm.supplierId,
      supplierProspectId: orm.supplierProspectId,
      status: orm.status,
      notes: orm.notes,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Requisition.reconstitute(props);
  }

  private toOrm(pr: Requisition): RequisitionOrmEntity {
    const orm = new RequisitionOrmEntity();
    orm.id = pr.id;
    orm.tenantId = pr.tenantId;
    orm.title = pr.title;
    orm.supplierId = pr.supplierId;
    orm.supplierProspectId = pr.supplierProspectId;
    orm.status = pr.status;
    orm.notes = pr.notes;
    orm.subtotal = pr.subtotal;
    orm.total = pr.total;
    orm.items = pr.items.map((item) => {
      const itemOrm = new RequisitionItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.requisitionId = item.requisitionId;
      itemOrm.itemType = item.itemType;
      itemOrm.itemId = item.itemId;
      itemOrm.description = item.description;
      itemOrm.quantity = item.quantity;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.lineTotal = item.lineTotal;
      return itemOrm;
    });
    return orm;
  }
}
