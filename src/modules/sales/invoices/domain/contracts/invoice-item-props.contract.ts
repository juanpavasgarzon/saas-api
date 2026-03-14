import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

export interface InvoiceItemProps {
  id: string;
  invoiceId: string;
  itemType: LineItemType;
  itemId: string;
  description: string;
  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number;
  lineTotal: number;
}
