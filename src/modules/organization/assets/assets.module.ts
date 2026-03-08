import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesModule } from '@modules/organization/employees/employees.module';

import { AssignAssetHandler } from './application/commands/assign-asset/assign-asset.handler';
import { CreateAssetHandler } from './application/commands/create-asset/create-asset.handler';
import { RetireAssetHandler } from './application/commands/retire-asset/retire-asset.handler';
import { ReturnAssetHandler } from './application/commands/return-asset/return-asset.handler';
import { UpdateAssetHandler } from './application/commands/update-asset/update-asset.handler';
import { GetAssetHandler } from './application/queries/get-asset/get-asset.handler';
import { ListAssetsHandler } from './application/queries/list-assets/list-assets.handler';
import { ASSET_REPOSITORY } from './domain/tokens/asset-repository.token';
import { AssetOrmEntity } from './infrastructure/entities/asset.orm-entity';
import { AssetAssignmentOrmEntity } from './infrastructure/entities/asset-assignment.orm-entity';
import { AssetTypeOrmRepository } from './infrastructure/repositories/asset.typeorm-repository';
import { AssetsController } from './presentation/controllers/assets.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AssetOrmEntity, AssetAssignmentOrmEntity]),
    EmployeesModule,
  ],
  controllers: [AssetsController],
  providers: [
    CreateAssetHandler,
    UpdateAssetHandler,
    RetireAssetHandler,
    AssignAssetHandler,
    ReturnAssetHandler,
    GetAssetHandler,
    ListAssetsHandler,
    { provide: ASSET_REPOSITORY, useClass: AssetTypeOrmRepository },
  ],
})
export class AssetsModule {}
