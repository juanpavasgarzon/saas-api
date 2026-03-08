import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IProductRepository } from '../../../domain/contracts/product-repository.contract';
import { type Product } from '../../../domain/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../../domain/tokens/product-repository.token';
import { ListProductsQuery } from './list-products.query';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<
  ListProductsQuery,
  PaginatedResult<Product>
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
