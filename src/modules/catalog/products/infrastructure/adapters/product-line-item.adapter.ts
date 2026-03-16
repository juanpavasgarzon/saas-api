import { Inject, Injectable } from '@nestjs/common';

import { type ILineItemTypeAdapter } from '@core/application/contracts/line-item-type-adapter.contract';

import { type IProductRepository } from '../../domain/contracts/product-repository.contract';
import { PRODUCT_REPOSITORY } from '../../domain/tokens/product-repository.token';

@Injectable()
export class ProductLineItemAdapter implements ILineItemTypeAdapter {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  findExistingIds(ids: string[], tenantId: string): Promise<string[]> {
    return this.productRepository.findExistingIds(ids, tenantId);
  }
}
