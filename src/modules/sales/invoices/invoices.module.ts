import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '@modules/organization/companies/companies.module';

import { CancelInvoiceHandler } from './application/commands/cancel-invoice/cancel-invoice.handler';
import { CreateInvoiceFromSaleHandler } from './application/commands/create-invoice-from-sale/create-invoice-from-sale.handler';
import { PayInvoiceHandler } from './application/commands/pay-invoice/pay-invoice.handler';
import { SendInvoiceHandler } from './application/commands/send-invoice/send-invoice.handler';
import { GetInvoiceHandler } from './application/queries/get-invoice/get-invoice.handler';
import { ListInvoicesHandler } from './application/queries/list-invoices/list-invoices.handler';
import { INVOICE_PDF_SERVICE } from './application/tokens/invoice-pdf-service.token';
import { INVOICE_REPOSITORY } from './domain/tokens/invoice-repository.token';
import { DealApprovedBillingConsumer } from './infrastructure/consumers/deal-approved-billing.consumer';
import { InvoiceOrmEntity } from './infrastructure/entities/invoice.orm-entity';
import { InvoiceItemOrmEntity } from './infrastructure/entities/invoice-item.orm-entity';
import { InvoiceTypeOrmRepository } from './infrastructure/repositories/invoice.typeorm-repository';
import { InvoicePdfService } from './infrastructure/services/invoice-pdf.service';
import { InvoicesController } from './presentation/controllers/invoices.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InvoiceOrmEntity, InvoiceItemOrmEntity]),
    CompaniesModule,
  ],
  controllers: [InvoicesController],
  providers: [
    CreateInvoiceFromSaleHandler,
    SendInvoiceHandler,
    PayInvoiceHandler,
    CancelInvoiceHandler,
    GetInvoiceHandler,
    ListInvoicesHandler,
    DealApprovedBillingConsumer,
    { provide: INVOICE_REPOSITORY, useClass: InvoiceTypeOrmRepository },
    { provide: INVOICE_PDF_SERVICE, useClass: InvoicePdfService },
  ],
})
export class InvoicesModule {}
