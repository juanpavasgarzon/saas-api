import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export interface QuotationItemProps {
  id: string;
  quotationId: string;
  description: string;
  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number;
  lineTotal: number;
}
