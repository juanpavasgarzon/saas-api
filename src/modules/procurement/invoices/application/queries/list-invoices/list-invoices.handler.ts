import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { type Invoice } from '../../../domain/entities/invoice.entity';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { ListInvoicesQuery } from './list-invoices.query';

@QueryHandler(ListInvoicesQuery)
export class ListInvoicesHandler implements IQueryHandler<
  ListInvoicesQuery,
  PaginatedResult<Invoice>
> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: IInvoiceRepository,
  ) {}

  async execute(query: ListInvoicesQuery): Promise<PaginatedResult<Invoice>> {
    const filters = {
      status: query.status,
      supplierId: query.supplierId,
      orderId: query.orderId,
    };
    return this.repository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
