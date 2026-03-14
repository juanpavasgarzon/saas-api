import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { type Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceNotFoundError } from '../../../domain/errors/invoice-not-found.error';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { GetInvoiceQuery } from './get-invoice.query';

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceHandler implements IQueryHandler<GetInvoiceQuery, Invoice> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: IInvoiceRepository,
  ) {}

  async execute(query: GetInvoiceQuery): Promise<Invoice> {
    const invoice = await this.repository.findById(query.id, query.tenantId);
    if (!invoice) {
      throw new InvoiceNotFoundError(query.id);
    }
    return invoice;
  }
}
