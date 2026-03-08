import { type MovementType } from '../../../domain/enums/movement-type.enum';

export class RegisterMovementCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly warehouseId: string | null,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly referenceId: string | null,
    public readonly notes: string | null,
  ) {}
}
