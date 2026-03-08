import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ForbiddenError } from '@shared/domain/errors/forbidden.error';
import { type IEmployeeStatusService } from '@modules/organization/shared/contracts/employee-status.contract';
import { EMPLOYEE_STATUS_SERVICE } from '@modules/organization/shared/tokens/employee-status.token';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { AssignAssetCommand } from './assign-asset.command';

@CommandHandler(AssignAssetCommand)
export class AssignAssetHandler implements ICommandHandler<AssignAssetCommand, void> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(EMPLOYEE_STATUS_SERVICE)
    private readonly employeeStatusService: IEmployeeStatusService,
  ) {}

  async execute(command: AssignAssetCommand): Promise<void> {
    if (command.employeeId) {
      const isActive = await this.employeeStatusService.isActive(
        command.employeeId,
        command.tenantId,
      );
      if (!isActive) {
        throw new ForbiddenError('Cannot assign asset to an inactive employee');
      }
    }

    const asset = await this.assetRepository.findById(command.id, command.tenantId);
    if (!asset) {
      throw new AssetNotFoundError();
    }
    asset.assign(command.projectId, command.employeeId);
    await this.assetRepository.save(asset);
  }
}
