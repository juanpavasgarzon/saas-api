import { type MovementSource } from '../enums/movement-source.enum';
import { type MovementType } from '../enums/movement-type.enum';

export class MovementRegisteredEvent {
  constructor(
    public readonly movementId: string,
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly warehouseId: string | null,
    public readonly toWarehouseId: string | null,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly source: MovementSource,
    public readonly referenceId: string | null,
  ) {}
}
