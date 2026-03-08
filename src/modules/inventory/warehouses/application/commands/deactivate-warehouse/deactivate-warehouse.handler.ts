import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse-not-found.error';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { DeactivateWarehouseCommand } from './deactivate-warehouse.command';

@CommandHandler(DeactivateWarehouseCommand)
export class DeactivateWarehouseHandler implements ICommandHandler<
  DeactivateWarehouseCommand,
  void
> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(command: DeactivateWarehouseCommand): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(command.id, command.tenantId);
    if (!warehouse) {
      throw new WarehouseNotFoundError(command.id);
    }

    warehouse.deactivate();
    await this.warehouseRepository.save(warehouse);
  }
}
