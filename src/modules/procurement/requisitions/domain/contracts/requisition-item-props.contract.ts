import { type LineItemType } from '@core/domain/enums/line-item-type.enum';

export interface RequisitionItemProps {
  id: string;
  requisitionId: string;
  itemType: LineItemType;
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
