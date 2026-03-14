import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DealsModule } from './deals/deals.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [CqrsModule, DealsModule, InvoicesModule],
})
export class SalesModule {}
