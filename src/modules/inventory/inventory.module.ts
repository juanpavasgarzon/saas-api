import { Module } from '@nestjs/common';

import { MovementsModule } from './movements/movements.module';
import { StockModule } from './stock/stock.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [WarehousesModule, StockModule, MovementsModule],
})
export class InventoryModule {}
