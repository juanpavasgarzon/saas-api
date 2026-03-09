import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IStockRepository } from '@modules/inventory/stock/domain/contracts/stock-repository.contract';
import { Stock } from '@modules/inventory/stock/domain/entities/stock.entity';
import { STOCK_REPOSITORY } from '@modules/inventory/stock/domain/tokens/stock-repository.token';

import { MovementType } from '../../domain/enums/movement-type.enum';
import { MovementRegisteredEvent } from '../../domain/events/movement-registered.event';

@EventsHandler(MovementRegisteredEvent)
export class MovementRegisteredEventHandler implements IEventHandler<MovementRegisteredEvent> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async handle(event: MovementRegisteredEvent): Promise<void> {
    if (event.type === MovementType.TRANSFER) {
      // EXIT from source warehouse
      if (event.warehouseId) {
        const sourceStock = await this.stockRepository.findByProductAndWarehouse(
          event.productId,
          event.warehouseId,
          event.tenantId,
        );
        if (sourceStock) {
          sourceStock.subtractQuantity(event.quantity);
          await this.stockRepository.save(sourceStock);
        }
      }
      // ENTRY to destination warehouse
      if (event.toWarehouseId) {
        let destStock = await this.stockRepository.findByProductAndWarehouse(
          event.productId,
          event.toWarehouseId,
          event.tenantId,
        );
        if (!destStock) {
          destStock = Stock.create(event.tenantId, event.productId, event.toWarehouseId);
        }
        destStock.addQuantity(event.quantity);
        await this.stockRepository.save(destStock);
      }
      return;
    }

    if (!event.warehouseId) {
      return; // no warehouse = no stock update
    }

    let stock = await this.stockRepository.findByProductAndWarehouse(
      event.productId,
      event.warehouseId,
      event.tenantId,
    );
    if (!stock) {
      stock = Stock.create(event.tenantId, event.productId, event.warehouseId);
    }

    if (event.type === MovementType.ENTRY) {
      stock.addQuantity(event.quantity);
    } else if (event.type === MovementType.EXIT) {
      stock.subtractQuantity(event.quantity);
    }

    await this.stockRepository.save(stock);
  }
}
