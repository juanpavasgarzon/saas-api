import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { InvoiceNotFoundError } from '../../../domain/errors/invoice-not-found.error';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { MarkInvoiceOverdueCommand } from './mark-invoice-overdue.command';

@CommandHandler(MarkInvoiceOverdueCommand)
export class MarkInvoiceOverdueHandler implements ICommandHandler<MarkInvoiceOverdueCommand, void> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: IInvoiceRepository,
  ) {}

  async execute(command: MarkInvoiceOverdueCommand): Promise<void> {
    const invoice = await this.repository.findById(command.id, command.tenantId);
    if (!invoice) {
      throw new InvoiceNotFoundError(command.id);
    }
    invoice.markOverdue();
    await this.repository.save(invoice);
  }
}
