import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IVendorRepository } from '../../../domain/contracts/vendor-repository.contract';
import { type Vendor } from '../../../domain/entities/vendor.entity';
import { VENDOR_REPOSITORY } from '../../../domain/tokens/vendor-repository.token';
import { ListVendorsQuery } from './list-vendors.query';

@QueryHandler(ListVendorsQuery)
export class ListVendorsHandler implements IQueryHandler<
  ListVendorsQuery,
  PaginatedResult<Vendor>
> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(query: ListVendorsQuery): Promise<PaginatedResult<Vendor>> {
    const filters = { search: query.search };
    return this.vendorRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
