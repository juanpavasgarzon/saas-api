import { Module } from '@nestjs/common';

import { ProspectsModule } from './prospects/prospects.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseRequestsModule } from './purchase-requests/purchase-requests.module';
import { VendorsModule } from './vendors/vendors.module';

@Module({
  imports: [VendorsModule, ProspectsModule, PurchaseRequestsModule, PurchaseOrdersModule],
})
export class ProcurementModule {}
