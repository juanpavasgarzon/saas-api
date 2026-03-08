import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IProductRepository } from '../../../domain/contracts/product-repository.contract';
import { Product } from '../../../domain/entities/product.entity';
import { ProductNotFoundError } from '../../../domain/errors/product-not-found.error';
import { PRODUCT_REPOSITORY } from '../../../domain/tokens/product-repository.token';
import { GetProductQuery } from './get-product.query';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery, Product> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(query.id, query.tenantId);
    if (!product) {
      throw new ProductNotFoundError(query.id);
    }
    return product;
  }
}
