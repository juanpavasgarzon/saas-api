import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(query: ListInvoicesQuery): Promise<PaginatedResult<Invoice>> {
    return this.invoiceRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
