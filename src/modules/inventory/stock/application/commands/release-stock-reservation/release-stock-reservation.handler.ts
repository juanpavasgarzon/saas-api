import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IStockRepository } from '../../../domain/contracts/stock-repository.contract';
import { STOCK_REPOSITORY } from '../../../domain/tokens/stock-repository.token';
import { ReleaseStockReservationCommand } from './release-stock-reservation.command';

@CommandHandler(ReleaseStockReservationCommand)
export class ReleaseStockReservationHandler implements ICommandHandler<
  ReleaseStockReservationCommand,
  void
> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: ReleaseStockReservationCommand): Promise<void> {
    const stocks = await this.stockRepository.findAllByProduct(command.productId, command.tenantId);

    let remaining = command.quantity;

    for (const stock of stocks.filter((s) => s.reservedQuantity > 0)) {
      if (remaining <= 0) {
        break;
      }
      const toRelease = Math.min(remaining, stock.reservedQuantity);
      stock.releaseReservation(toRelease);
      await this.stockRepository.save(stock);
      remaining -= toRelease;
    }
  }
}
