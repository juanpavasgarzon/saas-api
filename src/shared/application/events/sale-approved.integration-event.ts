import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type UnitOfMeasure } from '../../domain/enums/unit-of-measure.enum';

export class SaleApprovedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'sale.approved';
  readonly eventName = SaleApprovedIntegrationEvent.eventName;

  constructor(
    public readonly saleId: string,
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly items: Array<{
      productId: string | null;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
      lineTotal: number;
    }>,
  ) {}
}
