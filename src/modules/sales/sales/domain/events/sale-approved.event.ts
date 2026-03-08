import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export class SaleApprovedEvent {
  constructor(
    public readonly saleId: string,
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly items: Array<{
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
      lineTotal: number;
    }>,
  ) {}
}
