import { type StockFilters } from '../../../domain/contracts/stock-repository.contract';

export class ListStockQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: StockFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
