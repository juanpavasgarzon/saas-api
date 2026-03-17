import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateInvoiceHandler } from './application/commands/create-invoice/create-invoice.handler';
import { MarkInvoiceOverdueHandler } from './application/commands/mark-invoice-overdue/mark-invoice-overdue.handler';
import { MarkInvoicePaidHandler } from './application/commands/mark-invoice-paid/mark-invoice-paid.handler';
import { OrderReceivedEventHandler } from './application/event-handlers/order-received.event-handler';
import { GetInvoiceHandler } from './application/queries/get-invoice/get-invoice.handler';
import { ListInvoicesHandler } from './application/queries/list-invoices/list-invoices.handler';
import { INVOICE_REPOSITORY } from './domain/tokens/invoice-repository.token';
import { InvoiceOrmEntity } from './infrastructure/entities/invoice.orm-entity';
import { InvoiceTypeOrmRepository } from './infrastructure/repositories/invoice.typeorm-repository';
import { InvoicesController } from './presentation/controllers/invoices.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([InvoiceOrmEntity])],
  controllers: [InvoicesController],
  providers: [
    CreateInvoiceHandler,
    MarkInvoicePaidHandler,
    MarkInvoiceOverdueHandler,
    GetInvoiceHandler,
    ListInvoicesHandler,
    OrderReceivedEventHandler,
    { provide: INVOICE_REPOSITORY, useClass: InvoiceTypeOrmRepository },
  ],
})
export class InvoicesModule {}
