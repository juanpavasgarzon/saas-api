import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ForbiddenError } from '@core/domain/errors/forbidden.error';
import { type IEmployeeRepository } from '@modules/organization/employees/domain/contracts/employee-repository.contract';
import { EmployeeStatus } from '@modules/organization/employees/domain/enums/employee-status.enum';
import { EMPLOYEE_REPOSITORY } from '@modules/organization/employees/domain/tokens/employee-repository.token';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { AssignAssetCommand } from './assign-asset.command';

@CommandHandler(AssignAssetCommand)
export class AssignAssetHandler implements ICommandHandler<AssignAssetCommand, void> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(command: AssignAssetCommand): Promise<void> {
    if (command.employeeId) {
      const employee = await this.employeeRepository.findById(command.employeeId, command.tenantId);
      if (!employee || employee.status !== EmployeeStatus.ACTIVE) {
        throw new ForbiddenError('Cannot assign asset to an inactive employee');
      }
    }

    const asset = await this.assetRepository.findById(command.id, command.tenantId);
    if (!asset) {
      throw new AssetNotFoundError(command.id);
    }
    asset.assign(command.projectId, command.employeeId);
    await this.assetRepository.save(asset);
  }
}
