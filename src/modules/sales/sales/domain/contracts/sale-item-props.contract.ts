import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export interface SaleItemProps {
  id: string;
  saleId: string;
  description: string;
  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number;
  lineTotal: number;
}
