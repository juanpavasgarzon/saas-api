import { Module } from '@nestjs/common';

import { MovementsModule } from './movements/movements.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [ProductsModule, WarehousesModule, StockModule, MovementsModule],
})
export class InventoryModule {}
