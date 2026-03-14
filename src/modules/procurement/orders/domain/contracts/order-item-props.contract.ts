import { type LineItemType } from '@core/domain/enums/line-item-type.enum';

export interface OrderItemProps {
  id: string;
  orderId: string;
  itemType: LineItemType;
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
