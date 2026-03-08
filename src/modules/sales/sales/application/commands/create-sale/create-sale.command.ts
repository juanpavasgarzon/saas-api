import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export class CreateSaleCommand {
  constructor(
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly notes: string | null,
    public readonly items: Array<{
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ) {}
}
