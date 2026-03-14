import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateVendorHandler } from './application/commands/create-vendor/create-vendor.handler';
import { UpdateVendorHandler } from './application/commands/update-vendor/update-vendor.handler';
import { GetVendorHandler } from './application/queries/get-vendor/get-vendor.handler';
import { ListVendorsHandler } from './application/queries/list-vendors/list-vendors.handler';
import { VENDOR_REPOSITORY } from './domain/tokens/vendor-repository.token';
import { VendorOrmEntity } from './infrastructure/entities/vendor.orm-entity';
import { VendorTypeOrmRepository } from './infrastructure/repositories/vendor.typeorm-repository';
import { VendorsController } from './presentation/controllers/vendors.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([VendorOrmEntity])],
  controllers: [VendorsController],
  providers: [
    CreateVendorHandler,
    UpdateVendorHandler,
    GetVendorHandler,
    ListVendorsHandler,
    { provide: VENDOR_REPOSITORY, useClass: VendorTypeOrmRepository },
  ],
  exports: [VENDOR_REPOSITORY],
})
export class VendorsModule {}
