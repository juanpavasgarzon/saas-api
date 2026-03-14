import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSupplierHandler } from './application/commands/create-supplier/create-supplier.handler';
import { UpdateSupplierHandler } from './application/commands/update-supplier/update-supplier.handler';
import { GetSupplierHandler } from './application/queries/get-supplier/get-supplier.handler';
import { ListSuppliersHandler } from './application/queries/list-suppliers/list-suppliers.handler';
import { SUPPLIER_REPOSITORY } from './domain/tokens/supplier-repository.token';
import { SupplierOrmEntity } from './infrastructure/entities/supplier.orm-entity';
import { SupplierTypeOrmRepository } from './infrastructure/repositories/supplier.typeorm-repository';
import { SuppliersController } from './presentation/controllers/suppliers.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([SupplierOrmEntity])],
  controllers: [SuppliersController],
  providers: [
    CreateSupplierHandler,
    UpdateSupplierHandler,
    GetSupplierHandler,
    ListSuppliersHandler,
    { provide: SUPPLIER_REPOSITORY, useClass: SupplierTypeOrmRepository },
  ],
  exports: [SUPPLIER_REPOSITORY],
})
export class SuppliersModule {}
