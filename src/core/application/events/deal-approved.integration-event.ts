import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type LineItemType } from '../../domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '../../domain/enums/unit-of-measure.enum';

export class DealApprovedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'deal.approved';
  readonly eventName = DealApprovedIntegrationEvent.eventName;

  constructor(
    public readonly dealId: string,
    public readonly tenantId: string,
    public readonly customerId: string,
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
