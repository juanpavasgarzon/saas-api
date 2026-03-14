import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { InvoiceNotFoundError } from '../../../domain/errors/invoice-not-found.error';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { CancelInvoiceCommand } from './cancel-invoice.command';

@CommandHandler(CancelInvoiceCommand)
export class CancelInvoiceHandler implements ICommandHandler<CancelInvoiceCommand, void> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(command: CancelInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepository.findById(command.id, command.tenantId);
    if (!invoice) {
      throw new InvoiceNotFoundError(command.id);
    }
    invoice.cancel();
    await this.invoiceRepository.save(invoice);
  }
}
