import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse-not-found.error';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { UpdateWarehouseCommand } from './update-warehouse.command';

@CommandHandler(UpdateWarehouseCommand)
export class UpdateWarehouseHandler implements ICommandHandler<UpdateWarehouseCommand, void> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(command: UpdateWarehouseCommand): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(command.id, command.tenantId);
    if (!warehouse) {
      throw new WarehouseNotFoundError(command.id);
    }

    warehouse.update(command.name, command.location);
    await this.warehouseRepository.save(warehouse);
  }
}
