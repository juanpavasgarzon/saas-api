import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CrmModule } from './modules/crm/crm.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SalesModule } from './modules/sales/sales.module';
import { JwtAuthGuard } from './shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/presentation/guards/permissions.guard';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    IdentityModule,
    OrganizationModule,
    CrmModule,
    ProjectsModule,
    FinanceModule,
    InfrastructureModule,
    SalesModule,
    ProcurementModule,
    InventoryModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
