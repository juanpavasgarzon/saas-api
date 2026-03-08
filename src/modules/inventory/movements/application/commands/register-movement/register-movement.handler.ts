import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProductRepository } from '@modules/inventory/products/domain/contracts/product-repository.contract';
import { ProductNotFoundError } from '@modules/inventory/products/domain/errors/product-not-found.error';
import { PRODUCT_REPOSITORY } from '@modules/inventory/products/domain/tokens/product-repository.token';
import { type IStockRepository } from '@modules/inventory/stock/domain/contracts/stock-repository.contract';
import { Stock } from '@modules/inventory/stock/domain/entities/stock.entity';
import { STOCK_REPOSITORY } from '@modules/inventory/stock/domain/tokens/stock-repository.token';
import { type IWarehouseRepository } from '@modules/inventory/warehouses/domain/contracts/warehouse-repository.contract';
import { WarehouseNotFoundError } from '@modules/inventory/warehouses/domain/errors/warehouse-not-found.error';
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
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: RegisterMovementCommand): Promise<string> {
    const product = await this.productRepository.findById(command.productId, command.tenantId);
    if (!product) {
      throw new ProductNotFoundError(command.productId);
    }

    if (command.warehouseId) {
      const warehouse = await this.warehouseRepository.findById(
        command.warehouseId,
        command.tenantId,
      );
      if (!warehouse) {
        throw new WarehouseNotFoundError(command.warehouseId);
      }
    }

    const movement = Movement.create(
      command.tenantId,
      command.productId,
      command.warehouseId,
      command.type,
      command.quantity,
      command.referenceId,
      command.notes,
    );

    await this.movementRepository.save(movement);

    if (command.warehouseId) {
      let stock = await this.stockRepository.findByProductAndWarehouse(
        command.productId,
        command.warehouseId,
        command.tenantId,
      );

      if (!stock) {
        stock = Stock.create(command.tenantId, command.productId, command.warehouseId);
      }

      if (command.type === MovementType.ENTRY) {
        stock.addQuantity(command.quantity);
      } else if (command.type === MovementType.EXIT) {
        stock.subtractQuantity(command.quantity);
      }

      await this.stockRepository.save(stock);
    }

    return movement.id;
  }
}
