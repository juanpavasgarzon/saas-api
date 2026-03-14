import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

export class CreateQuotationCommand {
  constructor(
    public readonly tenantId: string,
    public readonly title: string,
    public readonly customerId: string | null,
    public readonly prospectId: string | null,
    public readonly notes: string | null,
    public readonly validUntil: Date | null,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ) {}
}
