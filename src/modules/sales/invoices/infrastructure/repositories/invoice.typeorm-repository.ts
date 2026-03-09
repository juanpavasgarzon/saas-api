import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type InvoiceFilters } from '../../domain/contracts/invoice-filters.contract';
import { type InvoiceItemProps } from '../../domain/contracts/invoice-item-props.contract';
import { type InvoiceProps } from '../../domain/contracts/invoice-props.contract';
import { type IInvoiceRepository } from '../../domain/contracts/invoice-repository.contract';
import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceOrmEntity } from '../entities/invoice.orm-entity';
import { InvoiceItemOrmEntity } from '../entities/invoice-item.orm-entity';

@Injectable()
export class InvoiceTypeOrmRepository implements IInvoiceRepository {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    private readonly repository: Repository<InvoiceOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Invoice | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: InvoiceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Invoice>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.customerId) {
      where.customerId = filters.customerId;
    }
    if (filters.saleId) {
      where.saleId = filters.saleId;
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
      .createQueryBuilder('inv')
      .select('MAX(inv.number)', 'max')
      .where('inv.tenantId = :tenantId', { tenantId })
      .getRawOne<{ max: number | null }>();

    return (result?.max ?? 0) + 1;
  }

  async save(invoice: Invoice): Promise<void> {
    await this.repository.save(this.toOrm(invoice));
  }

  private toDomain(orm: InvoiceOrmEntity): Invoice {
    const items = (orm.items ?? []).map(
      (i): InvoiceItemProps => ({
        id: i.id,
        invoiceId: i.invoiceId,
        description: i.description,
        quantity: Number(i.quantity),
        unit: i.unit,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }),
    );

    const props: InvoiceProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      number: Number(orm.number),
      saleId: orm.saleId,
      customerId: orm.customerId,
      status: orm.status,
      notes: orm.notes,
      subtotal: Number(orm.subtotal),
      total: Number(orm.total),
      sentAt: orm.sentAt,
      paidAt: orm.paidAt,
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Invoice.reconstitute(props);
  }

  private toOrm(invoice: Invoice): InvoiceOrmEntity {
    const orm = new InvoiceOrmEntity();
    orm.id = invoice.id;
    orm.tenantId = invoice.tenantId;
    orm.number = invoice.number;
    orm.saleId = invoice.saleId;
    orm.customerId = invoice.customerId;
    orm.status = invoice.status;
    orm.notes = invoice.notes;
    orm.subtotal = invoice.subtotal;
    orm.total = invoice.total;
    orm.sentAt = invoice.sentAt;
    orm.paidAt = invoice.paidAt;
    orm.createdAt = invoice.createdAt;
    orm.updatedAt = invoice.updatedAt;
    orm.items = invoice.items.map((item) => {
      const itemOrm = new InvoiceItemOrmEntity();
      itemOrm.id = item.id;
      itemOrm.invoiceId = item.invoiceId;
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
