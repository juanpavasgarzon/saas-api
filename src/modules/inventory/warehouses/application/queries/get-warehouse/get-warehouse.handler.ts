import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IWarehouseRepository } from '../../../domain/contracts/warehouse-repository.contract';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse-not-found.error';
import { WAREHOUSE_REPOSITORY } from '../../../domain/tokens/warehouse-repository.token';
import { GetWarehouseQuery } from './get-warehouse.query';

@QueryHandler(GetWarehouseQuery)
export class GetWarehouseHandler implements IQueryHandler<GetWarehouseQuery, Warehouse> {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(query: GetWarehouseQuery): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findById(query.id, query.tenantId);
    if (!warehouse) {
      throw new WarehouseNotFoundError(query.id);
    }
    return warehouse;
  }
}
