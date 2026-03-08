import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PROSPECT_TO_VENDOR_SERVICE } from '@modules/procurement/shared/tokens/prospect-to-vendor.token';
import { VendorsModule } from '@modules/procurement/vendors/vendors.module';

import { ProspectToVendorAdapter } from './application/adapters/prospect-to-vendor.adapter';
import { CreateProspectHandler } from './application/commands/create-prospect/create-prospect.handler';
import { PROSPECT_REPOSITORY } from './domain/tokens/prospect-repository.token';
import { ProspectOrmEntity } from './infrastructure/entities/prospect.orm-entity';
import { ProspectTypeOrmRepository } from './infrastructure/repositories/prospect.typeorm-repository';
import { ProspectsController } from './presentation/controllers/prospects.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProspectOrmEntity]), VendorsModule],
  controllers: [ProspectsController],
  providers: [
    CreateProspectHandler,
    ProspectToVendorAdapter,
    { provide: PROSPECT_REPOSITORY, useClass: ProspectTypeOrmRepository },
    { provide: PROSPECT_TO_VENDOR_SERVICE, useClass: ProspectToVendorAdapter },
  ],
  exports: [PROSPECT_TO_VENDOR_SERVICE, PROSPECT_REPOSITORY],
})
export class ProspectsModule {}
