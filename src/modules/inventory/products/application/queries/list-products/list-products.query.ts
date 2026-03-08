import { type ProductFilters } from '../../../domain/contracts/product-repository.contract';

export class ListProductsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: ProductFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
