import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export class CreateInvoiceFromSaleCommand {
  constructor(
    public readonly tenantId: string,
    public readonly saleId: string,
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
