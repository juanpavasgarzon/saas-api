import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '@modules/inventory/products/products.module';
import { StockModule } from '@modules/inventory/stock/stock.module';
import { WarehousesModule } from '@modules/inventory/warehouses/warehouses.module';

import { RegisterMovementHandler } from './application/commands/register-movement/register-movement.handler';
import { MovementRegisteredEventHandler } from './application/event-handlers/movement-registered.event-handler';
import { PurchaseOrderReceivedIntegrationEventHandler } from './application/event-handlers/purchase-order-received.integration-event-handler';
import { SaleApprovedIntegrationEventHandler } from './application/event-handlers/sale-approved.integration-event-handler';
import { GetMovementHandler } from './application/queries/get-movement/get-movement.handler';
import { ListMovementsHandler } from './application/queries/list-movements/list-movements.handler';
import { MOVEMENT_REPOSITORY } from './domain/tokens/movement-repository.token';
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
    SaleApprovedIntegrationEventHandler,
    PurchaseOrderReceivedIntegrationEventHandler,
    GetMovementHandler,
    ListMovementsHandler,
    { provide: MOVEMENT_REPOSITORY, useClass: MovementTypeOrmRepository },
  ],
})
export class MovementsModule {}
