import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Movement } from '../entities/movement.entity';
import { type MovementType } from '../enums/movement-type.enum';

export interface MovementFilters {
  productId?: string;
  warehouseId?: string;
  type?: MovementType;
}

export interface IMovementRepository {
  findById(id: string, tenantId: string): Promise<Movement | null>;
  findAll(
    tenantId: string,
    filters: MovementFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Movement>>;
  save(movement: Movement): Promise<void>;
}
