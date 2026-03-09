import { type MovementSource } from '../enums/movement-source.enum';
import { type MovementType } from '../enums/movement-type.enum';

export interface MovementProps {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string | null;
  toWarehouseId: string | null;
  type: MovementType;
  quantity: number;
  source: MovementSource;
  referenceId: string | null;
  notes: string | null;
  createdAt: Date;
}
