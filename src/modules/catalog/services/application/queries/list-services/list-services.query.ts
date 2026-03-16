import { type ServiceFilters } from '../../../domain/contracts/service-repository.contract';

export class ListServicesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: ServiceFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
