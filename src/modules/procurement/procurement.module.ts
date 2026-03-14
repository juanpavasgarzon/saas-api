import { Module } from '@nestjs/common';

import { InvoicesModule } from './invoices/invoices.module';
import { OrdersModule } from './orders/orders.module';
import { ProspectsModule } from './prospects/prospects.module';
import { RequisitionsModule } from './requisitions/requisitions.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [SuppliersModule, ProspectsModule, RequisitionsModule, OrdersModule, InvoicesModule],
})
export class ProcurementModule {}
