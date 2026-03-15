import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '@modules/crm/customers/customers.module';

import { CreateProspectHandler } from './application/commands/create-prospect/create-prospect.handler';
import { DeleteProspectHandler } from './application/commands/delete-prospect/delete-prospect.handler';
import { UpdateProspectHandler } from './application/commands/update-prospect/update-prospect.handler';
import { UpdateProspectStatusHandler } from './application/commands/update-prospect-status/update-prospect-status.handler';
import { ProspectConvertedEventHandler } from './application/event-handlers/prospect.converted.event-handler';
import { GetProspectHandler } from './application/queries/get-prospect/get-prospect.handler';
import { ListProspectsHandler } from './application/queries/list-prospects/list-prospects.handler';
import { SearchCustomersHandler } from './application/queries/search-prospects/search-prospects.handler';
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
    SearchCustomersHandler,
    ProspectConvertedEventHandler,
    { provide: PROSPECT_REPOSITORY, useClass: ProspectTypeOrmRepository },
  ],
  exports: [PROSPECT_REPOSITORY],
})
export class ProspectsModule {}
