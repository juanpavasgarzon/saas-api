import { type MovementType } from '../enums/movement-type.enum';

export interface MovementProps {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string | null;
  type: MovementType;
  quantity: number;
  referenceId: string | null;
  notes: string | null;
  createdAt: Date;
}
