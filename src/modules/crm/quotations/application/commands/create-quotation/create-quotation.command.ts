import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export class CreateQuotationCommand {
  constructor(
    public readonly tenantId: string,
    public readonly title: string,
    public readonly customerId: string | null,
    public readonly prospectId: string | null,
    public readonly notes: string | null,
    public readonly validUntil: Date | null,
    public readonly items: Array<{
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ) {}
}
