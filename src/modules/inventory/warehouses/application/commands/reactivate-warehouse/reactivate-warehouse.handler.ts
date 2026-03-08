import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse-not-found.error';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { ReactivateWarehouseCommand } from './reactivate-warehouse.command';

@CommandHandler(ReactivateWarehouseCommand)
export class ReactivateWarehouseHandler implements ICommandHandler<
  ReactivateWarehouseCommand,
  void
> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(command: ReactivateWarehouseCommand): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(command.id, command.tenantId);
    if (!warehouse) {
      throw new WarehouseNotFoundError(command.id);
    }

    warehouse.activate();
    await this.warehouseRepository.save(warehouse);
  }
}
