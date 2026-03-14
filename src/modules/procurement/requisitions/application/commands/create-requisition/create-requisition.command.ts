import { type LineItemType } from '@core/domain/enums/line-item-type.enum';

export class CreateRequisitionCommand {
  constructor(
    public readonly tenantId: string,
    public readonly title: string,
    public readonly supplierId: string | null,
    public readonly supplierProspectId: string | null,
    public readonly notes: string | null,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
  ) {}
}
