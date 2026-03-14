import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type ISupplierRepository } from '../../../domain/contracts/supplier-repository.contract';
import { type Supplier } from '../../../domain/entities/supplier.entity';
import { SupplierNotFoundError } from '../../../domain/errors/supplier-not-found.error';
import { SUPPLIER_REPOSITORY } from '../../../domain/tokens/supplier-repository.token';
import { GetSupplierQuery } from './get-supplier.query';

@QueryHandler(GetSupplierQuery)
export class GetSupplierHandler implements IQueryHandler<GetSupplierQuery, Supplier> {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(query: GetSupplierQuery): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(query.id, query.tenantId);
    if (!supplier) {
      throw new SupplierNotFoundError(query.id);
    }
    return supplier;
  }
}
