import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '@modules/catalog/products/products.module';
import { StockModule } from '@modules/inventory/stock/stock.module';
import { WarehousesModule } from '@modules/inventory/warehouses/warehouses.module';

import { RegisterMovementHandler } from './application/commands/register-movement/register-movement.handler';
import { MovementRegisteredEventHandler } from './application/event-handlers/movement-registered.event-handler';
import { GetMovementHandler } from './application/queries/get-movement/get-movement.handler';
import { ListMovementsHandler } from './application/queries/list-movements/list-movements.handler';
import { MOVEMENT_REPOSITORY } from './domain/tokens/movement-repository.token';
import { DealApprovedConsumer } from './infrastructure/consumers/deal-approved.consumer';
import { OrderReceivedConsumer } from './infrastructure/consumers/order-received.consumer';
import { QuotationAcceptedReservationConsumer } from './infrastructure/consumers/quotation-accepted-reservation.consumer';
import { QuotationExpiredReservationConsumer } from './infrastructure/consumers/quotation-expired-reservation.consumer';
import { QuotationRejectedReservationConsumer } from './infrastructure/consumers/quotation-rejected-reservation.consumer';
import { MovementOrmEntity } from './infrastructure/entities/movement.orm-entity';
import { MovementTypeOrmRepository } from './infrastructure/repositories/movement.typeorm-repository';
import { MovementsController } from './presentation/controllers/movements.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([MovementOrmEntity]),
    ProductsModule,
    WarehousesModule,
    StockModule,
  ],
  controllers: [MovementsController],
  providers: [
    RegisterMovementHandler,
    MovementRegisteredEventHandler,
    GetMovementHandler,
    ListMovementsHandler,
    QuotationAcceptedReservationConsumer,
    QuotationExpiredReservationConsumer,
    QuotationRejectedReservationConsumer,
    DealApprovedConsumer,
    OrderReceivedConsumer,
    { provide: MOVEMENT_REPOSITORY, useClass: MovementTypeOrmRepository },
  ],
})
export class MovementsModule {}
