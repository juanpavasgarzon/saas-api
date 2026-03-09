import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RabbitMQModule } from '@shared/infrastructure/messaging/rabbitmq.module';

import { PurchaseOrderReceivedConsumer } from './movements/infrastructure/consumers/purchase-order-received.consumer';
import { SaleApprovedConsumer } from './movements/infrastructure/consumers/sale-approved.consumer';
import { MovementsModule } from './movements/movements.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [
    CqrsModule,
    RabbitMQModule,
    ProductsModule,
    WarehousesModule,
    StockModule,
    MovementsModule,
  ],
  providers: [SaleApprovedConsumer, PurchaseOrderReceivedConsumer],
})
export class InventoryModule {}
