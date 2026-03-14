import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type ISupplierRepository } from '../../../domain/contracts/supplier-repository.contract';
import { type Supplier } from '../../../domain/entities/supplier.entity';
import { SUPPLIER_REPOSITORY } from '../../../domain/tokens/supplier-repository.token';
import { ListSuppliersQuery } from './list-suppliers.query';

@QueryHandler(ListSuppliersQuery)
export class ListSuppliersHandler implements IQueryHandler<
  ListSuppliersQuery,
  PaginatedResult<Supplier>
> {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(query: ListSuppliersQuery): Promise<PaginatedResult<Supplier>> {
    const filters = { search: query.search };
    return this.supplierRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
