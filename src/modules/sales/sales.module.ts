import { Module } from '@nestjs/common';

import { InvoicesModule } from './invoices/invoices.module';
import { SalesSubmoduleModule } from './sales/sales-submodule.module';

@Module({
  imports: [SalesSubmoduleModule, InvoicesModule],
})
export class SalesModule {}
