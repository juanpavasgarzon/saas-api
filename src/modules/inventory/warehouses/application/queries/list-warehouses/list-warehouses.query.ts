import { type WarehouseFilters } from '../../../domain/contracts/warehouse-repository.contract';

export class ListWarehousesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: WarehouseFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
