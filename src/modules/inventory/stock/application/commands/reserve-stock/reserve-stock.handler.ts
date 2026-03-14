import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IStockRepository } from '../../../domain/contracts/stock-repository.contract';
import { STOCK_REPOSITORY } from '../../../domain/tokens/stock-repository.token';
import { ReserveStockCommand } from './reserve-stock.command';

@CommandHandler(ReserveStockCommand)
export class ReserveStockHandler implements ICommandHandler<ReserveStockCommand, void> {
  private readonly logger = new Logger(ReserveStockHandler.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: ReserveStockCommand): Promise<void> {
    const stocks = await this.stockRepository.findAllByProduct(command.productId, command.tenantId);

    let remaining = command.quantity;

    for (const stock of stocks.sort((a, b) => b.availableQuantity - a.availableQuantity)) {
      if (remaining <= 0) {
        break;
      }
      const toReserve = Math.min(remaining, stock.availableQuantity);
      if (toReserve <= 0) {
        continue;
      }
      stock.reserve(toReserve);
      await this.stockRepository.save(stock);
      remaining -= toReserve;
    }

    if (remaining > 0) {
      this.logger.warn(
        `Could not fully reserve stock for product ${command.productId}. ` +
          `Remaining: ${remaining} of ${command.quantity} (ref: ${command.referenceId})`,
      );
    }
  }
}
