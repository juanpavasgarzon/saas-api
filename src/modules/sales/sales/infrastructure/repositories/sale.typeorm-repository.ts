import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type SaleFilters } from '../../domain/contracts/sale-filters.contract';
import { type SaleItemProps } from '../../domain/contracts/sale-item-props.contract';
import { type SaleProps } from '../../domain/contracts/sale-props.contract';
import { type ISaleRepository } from '../../domain/contracts/sale-repository.contract';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleOrmEntity } from '../entities/sale.orm-entity';
import { SaleItemOrmEntity } from '../entities/sale-item.orm-entity';

@Injectable()
export class SaleTypeOrmRepository implements ISaleRepository {
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly repository: Repository<SaleOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Sale | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: SaleFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Sale>> {
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

  async save(sale: Sale): Promise<void> {
    await this.repository.save(this.toOrm(sale));
  }

  private toDomain(orm: SaleOrmEntity): Sale {
    const items = (orm.items ?? []).map(
      (i): SaleItemProps => ({
        id: i.id,
        saleId: i.saleId,
        description: i.description,
        quantity: Number(i.quantity),
        unit: i.unit,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: SaleProps = {
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
    return Sale.reconstitute(props);
  }

  private toOrm(sale: Sale): SaleOrmEntity {
    const orm = new SaleOrmEntity();
    orm.id = sale.id;
    orm.tenantId = sale.tenantId;
    orm.number = sale.number;
    orm.customerId = sale.customerId;
    orm.quotationId = sale.quotationId;
    orm.status = sale.status;
    orm.notes = sale.notes;
    orm.subtotal = sale.subtotal;
    orm.total = sale.total;
    orm.createdAt = sale.createdAt;
    orm.updatedAt = sale.updatedAt;
    orm.items = sale.items.map((item) => {
      const itemOrm = new SaleItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.saleId = item.saleId;
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
