import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type SaleFilters } from '../../domain/contracts/deal-filters.contract';
import { type DealItemProps } from '../../domain/contracts/deal-item-props.contract';
import { type DealProps } from '../../domain/contracts/deal-props.contract';
import { type IDealRepository } from '../../domain/contracts/deal-repository.contract';
import { Deal } from '../../domain/entities/deal.entity';
import { DealOrmEntity } from '../entities/deal.orm-entity';
import { DealItemOrmEntity } from '../entities/deal-item.orm-entity';

@Injectable()
export class DealTypeOrmRepository implements IDealRepository {
  constructor(
    @InjectRepository(DealOrmEntity)
    private readonly repository: Repository<DealOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Deal | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: SaleFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Deal>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { number: 'DESC' },
    });
    return { items: items.map((i) => this.toDomain(i)), total, page, limit };
  }

  async nextNumber(tenantId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('s')
      .select('MAX(s.number)', 'max')
      .where('s.tenantId = :tenantId', { tenantId })
      .getRawOne<{ max: number | null }>();

    return (result?.max ?? 0) + 1;
  }

  async save(deal: Deal): Promise<void> {
    await this.repository.save(this.toOrm(deal));
  }

  private toDomain(orm: DealOrmEntity): Deal {
    const items = (orm.items ?? []).map(
      (i): DealItemProps => ({
        id: i.id,
        dealId: i.dealId,
        description: i.description,
        quantity: Number(i.quantity),
        unit: i.unit,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
        itemType: i.itemType,
        itemId: i.itemId,
      }),
    );

    const props: DealProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      number: Number(orm.number),
      customerId: orm.customerId,
      quotationId: orm.quotationId,
      status: orm.status,
      notes: orm.notes,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Deal.reconstitute(props);
  }

  private toOrm(deal: Deal): DealOrmEntity {
    const orm = new DealOrmEntity();
    orm.id = deal.id;
    orm.tenantId = deal.tenantId;
    orm.number = deal.number;
    orm.customerId = deal.customerId;
    orm.quotationId = deal.quotationId;
    orm.status = deal.status;
    orm.notes = deal.notes;
    orm.subtotal = deal.subtotal;
    orm.total = deal.total;
    orm.createdAt = deal.createdAt;
    orm.updatedAt = deal.updatedAt;
    orm.items = deal.items.map((item) => {
      const itemOrm = new DealItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.dealId = item.dealId;
      itemOrm.description = item.description;
      itemOrm.quantity = item.quantity;
      itemOrm.unit = item.unit;
      itemOrm.unitPrice = item.unitPrice;
      itemOrm.lineTotal = item.lineTotal;
      return itemOrm;
    });
    return orm;
  }
}
