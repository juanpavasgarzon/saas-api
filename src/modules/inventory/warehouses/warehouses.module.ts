import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateWarehouseHandler } from './application/commands/create-warehouse/create-warehouse.handler';
import { DeactivateWarehouseHandler } from './application/commands/deactivate-warehouse/deactivate-warehouse.handler';
import { ReactivateWarehouseHandler } from './application/commands/reactivate-warehouse/reactivate-warehouse.handler';
import { UpdateWarehouseHandler } from './application/commands/update-warehouse/update-warehouse.handler';
import { GetWarehouseHandler } from './application/queries/get-warehouse/get-warehouse.handler';
import { ListWarehousesHandler } from './application/queries/list-warehouses/list-warehouses.handler';
import { WAREHOUSE_REPOSITORY } from './domain/tokens/warehouse-repository.token';
import { WarehouseOrmEntity } from './infrastructure/entities/warehouse.orm-entity';
import { WarehouseTypeOrmRepository } from './infrastructure/repositories/warehouse.typeorm-repository';
import { WarehousesController } from './presentation/controllers/warehouses.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([WarehouseOrmEntity])],
  controllers: [WarehousesController],
  providers: [
    CreateWarehouseHandler,
    UpdateWarehouseHandler,
    DeactivateWarehouseHandler,
    ReactivateWarehouseHandler,
    GetWarehouseHandler,
    ListWarehousesHandler,
    { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseTypeOrmRepository },
  ],
  exports: [WAREHOUSE_REPOSITORY],
})
export class WarehousesModule {}
