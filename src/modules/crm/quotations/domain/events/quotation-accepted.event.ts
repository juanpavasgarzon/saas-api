import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

export class QuotationAcceptedEvent {
  constructor(
    public readonly quotationId: string,
    public readonly tenantId: string,
    public readonly customerId: string | null,
    public readonly prospectId: string | null,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
      lineTotal: number;
    }>,
  ) {}
}
