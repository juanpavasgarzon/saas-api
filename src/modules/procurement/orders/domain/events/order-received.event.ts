import { type LineItemType } from '@core/domain/enums/line-item-type.enum';

export class OrderReceivedEvent {
  constructor(
    public readonly orderId: string,
    public readonly tenantId: string,
    public readonly supplierId: string,
    public readonly total: number,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
  ) {}
}
