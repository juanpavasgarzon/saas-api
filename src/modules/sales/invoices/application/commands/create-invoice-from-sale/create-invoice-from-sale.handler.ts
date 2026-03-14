import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IInvoiceRepository } from '../../../domain/contracts/invoice-repository.contract';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { INVOICE_REPOSITORY } from '../../../domain/tokens/invoice-repository.token';
import { CreateInvoiceFromSaleCommand } from './create-invoice-from-sale.command';

@CommandHandler(CreateInvoiceFromSaleCommand)
export class CreateInvoiceFromSaleHandler implements ICommandHandler<
  CreateInvoiceFromSaleCommand,
  string
> {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(command: CreateInvoiceFromSaleCommand): Promise<string> {
    const number = await this.invoiceRepository.nextNumber(command.tenantId);
    const invoice = Invoice.createFromSale(
      command.tenantId,
      number,
      command.dealId,
      command.customerId,
      command.items,
    );
    await this.invoiceRepository.save(invoice);
    return invoice.id;
  }
}
