import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SERVICE_LINE_ITEM_ADAPTER } from '@core/application/tokens/line-item-adapters.tokens';

import { CreateServiceHandler } from './application/commands/create-service/create-service.handler';
import { DeactivateServiceHandler } from './application/commands/deactivate-service/deactivate-service.handler';
import { ReactivateServiceHandler } from './application/commands/reactivate-service/reactivate-service.handler';
import { UpdateServiceHandler } from './application/commands/update-service/update-service.handler';
import { GetServiceHandler } from './application/queries/get-service/get-service.handler';
import { ListServicesHandler } from './application/queries/list-services/list-services.handler';
import { SERVICE_REPOSITORY } from './domain/tokens/service-repository.token';
import { ServiceLineItemAdapter } from './infrastructure/adapters/service-line-item.adapter';
import { ServiceOrmEntity } from './infrastructure/entities/service.orm-entity';
import { ServiceTypeOrmRepository } from './infrastructure/repositories/service.typeorm-repository';
import { ServicesController } from './presentation/controllers/services.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ServiceOrmEntity])],
  controllers: [ServicesController],
  providers: [
    CreateServiceHandler,
    UpdateServiceHandler,
    DeactivateServiceHandler,
    ReactivateServiceHandler,
    GetServiceHandler,
    ListServicesHandler,
    { provide: SERVICE_REPOSITORY, useClass: ServiceTypeOrmRepository },
    { provide: SERVICE_LINE_ITEM_ADAPTER, useClass: ServiceLineItemAdapter },
  ],
  exports: [SERVICE_REPOSITORY, SERVICE_LINE_ITEM_ADAPTER],
})
export class ServicesModule {}
