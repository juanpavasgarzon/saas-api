import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RabbitMQModule } from '@shared/infrastructure/messaging/rabbitmq.module';

import { SaleApprovedBillingConsumer } from './invoices/infrastructure/consumers/sale-approved-billing.consumer';
import { InvoicesModule } from './invoices/invoices.module';
import { QuotationAcceptedConsumer } from './sales/infrastructure/consumers/quotation-accepted.consumer';
import { SalesSubmoduleModule } from './sales/sales-submodule.module';

@Module({
  imports: [CqrsModule, RabbitMQModule, SalesSubmoduleModule, InvoicesModule],
  providers: [QuotationAcceptedConsumer, SaleApprovedBillingConsumer],
})
export class SalesModule {}
