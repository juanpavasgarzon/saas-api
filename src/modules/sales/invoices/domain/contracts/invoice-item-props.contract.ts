import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export interface InvoiceItemProps {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number;
  lineTotal: number;
}
