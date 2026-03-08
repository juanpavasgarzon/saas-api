import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../customers/customers.module';
import { PROSPECT_STATUS_SERVICE } from '../shared/tokens/prospect-status.token';
import { PROSPECT_TO_CUSTOMER_SERVICE } from '../shared/tokens/prospect-to-customer.token';
import { ProspectStatusAdapter } from './application/adapters/prospect-status.adapter';
import { ProspectToCustomerAdapter } from './application/adapters/prospect-to-customer.adapter';
import { CreateProspectHandler } from './application/commands/create-prospect/create-prospect.handler';
import { DeleteProspectHandler } from './application/commands/delete-prospect/delete-prospect.handler';
import { UpdateProspectHandler } from './application/commands/update-prospect/update-prospect.handler';
import { UpdateProspectStatusHandler } from './application/commands/update-prospect-status/update-prospect-status.handler';
import { GetProspectHandler } from './application/queries/get-prospect/get-prospect.handler';
import { ListProspectsHandler } from './application/queries/list-prospects/list-prospects.handler';
import { PROSPECT_REPOSITORY } from './domain/tokens/prospect-repository.token';
import { ProspectOrmEntity } from './infrastructure/entities/prospect.orm-entity';
import { ProspectTypeOrmRepository } from './infrastructure/repositories/prospect.typeorm-repository';
import { ProspectsController } from './presentation/controllers/prospects.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProspectOrmEntity]), CustomersModule],
  controllers: [ProspectsController],
  providers: [
    CreateProspectHandler,
    UpdateProspectHandler,
    UpdateProspectStatusHandler,
    DeleteProspectHandler,
    GetProspectHandler,
    ListProspectsHandler,
    { provide: PROSPECT_REPOSITORY, useClass: ProspectTypeOrmRepository },
    { provide: PROSPECT_TO_CUSTOMER_SERVICE, useClass: ProspectToCustomerAdapter },
    { provide: PROSPECT_STATUS_SERVICE, useClass: ProspectStatusAdapter },
  ],
  exports: [PROSPECT_REPOSITORY, PROSPECT_TO_CUSTOMER_SERVICE, PROSPECT_STATUS_SERVICE],
})
export class ProspectsModule {}
