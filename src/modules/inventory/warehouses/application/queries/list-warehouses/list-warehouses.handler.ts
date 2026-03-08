import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { type Warehouse } from '../../../domain/entities/warehouse.entity';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { ListWarehousesQuery } from './list-warehouses.query';

@QueryHandler(ListWarehousesQuery)
export class ListWarehousesHandler implements IQueryHandler<
  ListWarehousesQuery,
  PaginatedResult<Warehouse>
> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(query: ListWarehousesQuery): Promise<PaginatedResult<Warehouse>> {
    return this.warehouseRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
