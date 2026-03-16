import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { NotFoundError } from '@core/domain/errors/not-found.error';
import { ValidationError } from '@core/domain/errors/validation.error';
import { type IProductRepository } from '@modules/catalog/products/domain/contracts/product-repository.contract';
import { PRODUCT_REPOSITORY } from '@modules/catalog/products/domain/tokens/product-repository.token';
import { type IWarehouseRepository } from '@modules/inventory/warehouses/domain/contracts/warehouse-repository.contract';
import { WAREHOUSE_REPOSITORY } from '@modules/inventory/warehouses/domain/tokens/warehouse-repository.token';

import { type IMovementRepository } from '../../../domain/contracts/movement-repository.contract';
import { Movement } from '../../../domain/entities/movement.entity';
import { MovementType } from '../../../domain/enums/movement-type.enum';
import { MOVEMENT_REPOSITORY } from '../../../domain/tokens/movement-repository.token';
import { RegisterMovementCommand } from './register-movement.command';

@CommandHandler(RegisterMovementCommand)
export class RegisterMovementHandler implements ICommandHandler<RegisterMovementCommand, string> {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMovementRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RegisterMovementCommand): Promise<string> {
    const product = await this.productRepository.findById(command.productId, command.tenantId);
    if (!product) {
      throw new NotFoundError('Product', command.productId);
    }

    if (command.warehouseId) {
      const warehouse = await this.warehouseRepository.findById(
        command.warehouseId,
        command.tenantId,
      );
      if (!warehouse) {
        throw new NotFoundError('Warehouse', command.warehouseId);
      }
    }

    if (command.type === MovementType.TRANSFER) {
      if (!command.warehouseId || !command.toWarehouseId) {
        throw new ValidationError('TRANSFER requires both warehouseId and toWarehouseId');
      }
      const toWarehouse = await this.warehouseRepository.findById(
        command.toWarehouseId,
        command.tenantId,
      );
      if (!toWarehouse) {
        throw new NotFoundError('Warehouse', command.toWarehouseId);
      }
    }

    const movement = Movement.create(
      command.tenantId,
      command.productId,
      command.warehouseId,
      command.toWarehouseId,
      command.type,
      command.quantity,
      command.source,
      command.referenceId,
      command.notes,
    );
    this.publisher.mergeObjectContext(movement);
    await this.movementRepository.save(movement);
    movement.commit();

    return movement.id;
  }
}
