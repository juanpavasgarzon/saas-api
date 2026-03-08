import { type MovementFilters } from '../../../domain/contracts/movement-repository.contract';

export class ListMovementsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: MovementFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
