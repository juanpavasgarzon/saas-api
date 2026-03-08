import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IVendorRepository } from '../../../domain/contracts/vendor-repository.contract';
import { type Vendor } from '../../../domain/entities/vendor.entity';
import { VendorNotFoundError } from '../../../domain/errors/vendor-not-found.error';
import { VENDOR_REPOSITORY } from '../../../domain/tokens/vendor-repository.token';
import { GetVendorQuery } from './get-vendor.query';

@QueryHandler(GetVendorQuery)
export class GetVendorHandler implements IQueryHandler<GetVendorQuery, Vendor> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(query: GetVendorQuery): Promise<Vendor> {
    const vendor = await this.vendorRepository.findById(query.id, query.tenantId);
    if (!vendor) {
      throw new VendorNotFoundError();
    }
    return vendor;
  }
}
