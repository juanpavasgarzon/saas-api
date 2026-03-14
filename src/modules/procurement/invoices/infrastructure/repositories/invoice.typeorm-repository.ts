import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type InvoiceFilters } from '../../domain/contracts/invoice-filters.contract';
import { type InvoiceProps } from '../../domain/contracts/invoice-props.contract';
import { type IInvoiceRepository } from '../../domain/contracts/invoice-repository.contract';
import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceOrmEntity } from '../entities/invoice.orm-entity';

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
    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }
    if (filters.orderId) {
      where.orderId = filters.orderId;
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
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
      .createQueryBuilder('si')
      .select('MAX(si.number)', 'max')
      .where('si.tenantId = :tenantId', { tenantId })
      .getRawOne<{ max: number | null }>();
    return (result?.max ?? 0) + 1;
  }

  async save(invoice: Invoice): Promise<void> {
    await this.repository.save(this.toOrm(invoice));
  }

  private toDomain(orm: InvoiceOrmEntity): Invoice {
    const props: InvoiceProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      number: orm.number,
      invoiceNumber: orm.invoiceNumber,
      supplierId: orm.supplierId,
      orderId: orm.orderId,
      amount: Number(orm.amount),
      dueDate: orm.dueDate,
      status: orm.status,
      notes: orm.notes,
      paidAt: orm.paidAt,
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
    orm.invoiceNumber = invoice.invoiceNumber;
    orm.supplierId = invoice.supplierId;
    orm.orderId = invoice.orderId;
    orm.amount = invoice.amount;
    orm.dueDate = invoice.dueDate;
    orm.status = invoice.status;
    orm.notes = invoice.notes;
    orm.paidAt = invoice.paidAt;
    orm.createdAt = invoice.createdAt;
    orm.updatedAt = invoice.updatedAt;
    return orm;
  }
}
