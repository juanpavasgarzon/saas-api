import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type QuotationFilters } from '../../domain/contracts/quotation-filters.contract';
import { type QuotationItemProps } from '../../domain/contracts/quotation-item-props.contract';
import { type QuotationProps } from '../../domain/contracts/quotation-props.contract';
import { type IQuotationRepository } from '../../domain/contracts/quotation-repository.contract';
import { Quotation } from '../../domain/entities/quotation.entity';
import { QuotationOrmEntity } from '../entities/quotation.orm-entity';
import { QuotationItemOrmEntity } from '../entities/quotation-item.orm-entity';

@Injectable()
export class QuotationTypeOrmRepository implements IQuotationRepository {
  constructor(
    @InjectRepository(QuotationOrmEntity)
    private readonly repository: Repository<QuotationOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Quotation | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: QuotationFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Quotation>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.prospectId) {
      where.prospectId = filters.prospectId;
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { number: 'DESC' },
    });

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async nextNumber(tenantId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('q')
      .select('MAX(q.number)', 'max')
      .where('q.tenantId = :tenantId', { tenantId })
      .getRawOne<{ max: number | null }>();

    return (result?.max ?? 0) + 1;
  }

  async save(quotation: Quotation): Promise<void> {
    const orm = this.toOrm(quotation);
    await this.repository.manager.transaction(async (em) => {
      await em.delete(QuotationItemOrmEntity, { quotationId: quotation.id });
      const header = { ...orm, items: undefined };
      await em.save(QuotationOrmEntity, header);
      if (orm.items.length > 0) {
        await em.save(QuotationItemOrmEntity, orm.items);
      }
    });
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: QuotationOrmEntity): Quotation {
    const items = (orm.items ?? []).map(
      (i): QuotationItemProps => ({
        id: i.id,
        quotationId: i.quotationId,
        description: i.description,
        quantity: Number(i.quantity),
        unit: i.unit,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: QuotationProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      number: Number(orm.number),
      title: orm.title,
      customerId: orm.customerId,
      prospectId: orm.prospectId,
      status: orm.status,
      notes: orm.notes,
      validUntil: orm.validUntil,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Quotation.reconstitute(props);
  }

  private toOrm(quotation: Quotation): QuotationOrmEntity {
    const orm = new QuotationOrmEntity();
    orm.id = quotation.id;
    orm.tenantId = quotation.tenantId;
    orm.number = quotation.number;
    orm.title = quotation.title;
    orm.customerId = quotation.customerId;
    orm.prospectId = quotation.prospectId;
    orm.status = quotation.status;
    orm.notes = quotation.notes;
    orm.validUntil = quotation.validUntil;
    orm.subtotal = quotation.subtotal;
    orm.total = quotation.total;
    orm.items = quotation.items.map((item) => {
      const itemOrm = new QuotationItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.quotationId = item.quotationId;
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
