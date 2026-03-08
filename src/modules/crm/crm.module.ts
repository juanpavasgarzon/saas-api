import { Module } from '@nestjs/common';

import { CustomersModule } from './customers/customers.module';
import { ProspectsModule } from './prospects/prospects.module';
import { QuotationsModule } from './quotations/quotations.module';

@Module({
  imports: [CustomersModule, ProspectsModule, QuotationsModule],
})
export class CrmModule {}
