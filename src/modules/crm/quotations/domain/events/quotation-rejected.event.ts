import { type LineItemType } from '@core/domain/enums/line-item-type.enum';

export class QuotationRejectedEvent {
  constructor(
    public readonly quotationId: string,
    public readonly tenantId: string,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      quantity: number;
    }>,
  ) {}
}
