import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReleaseStockReservationHandler } from './application/commands/release-stock-reservation/release-stock-reservation.handler';
import { ReserveStockHandler } from './application/commands/reserve-stock/reserve-stock.handler';
import { GetStockHandler } from './application/queries/get-stock/get-stock.handler';
import { ListStockHandler } from './application/queries/list-stock/list-stock.handler';
import { STOCK_REPOSITORY } from './domain/tokens/stock-repository.token';
import { StockOrmEntity } from './infrastructure/entities/stock.orm-entity';
import { StockTypeOrmRepository } from './infrastructure/repositories/stock.typeorm-repository';
import { StockController } from './presentation/controllers/stock.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([StockOrmEntity])],
  controllers: [StockController],
  providers: [
    ReserveStockHandler,
    ReleaseStockReservationHandler,
    GetStockHandler,
    ListStockHandler,
    { provide: STOCK_REPOSITORY, useClass: StockTypeOrmRepository },
  ],
  exports: [STOCK_REPOSITORY],
})
export class StockModule {}
