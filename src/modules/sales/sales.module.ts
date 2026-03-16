import { Module } from '@nestjs/common';

import { DealsModule } from './deals/deals.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [DealsModule, InvoicesModule],
})
export class SalesModule {}
