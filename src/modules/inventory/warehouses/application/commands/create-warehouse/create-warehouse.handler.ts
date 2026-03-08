import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { CreateWarehouseCommand } from './create-warehouse.command';

@CommandHandler(CreateWarehouseCommand)
export class CreateWarehouseHandler implements ICommandHandler<CreateWarehouseCommand, string> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(command: CreateWarehouseCommand): Promise<string> {
    const warehouse = Warehouse.create(command.tenantId, command.name, command.location);
    await this.warehouseRepository.save(warehouse);
    return warehouse.id;
  }
}
