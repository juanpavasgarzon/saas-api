import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { CreateInvoiceCommand } from './create-invoice.command';

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceHandler implements ICommandHandler<CreateInvoiceCommand, string> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: IInvoiceRepository,
  ) {}

  async execute(command: CreateInvoiceCommand): Promise<string> {
    const number = await this.repository.nextNumber(command.tenantId);
    const invoice = Invoice.create(
      command.tenantId,
      number,
      command.invoiceNumber,
      command.supplierId,
      command.orderId,
      command.amount,
      command.dueDate,
      command.notes,
    );
    await this.repository.save(invoice);
    return invoice.id;
  }
}
