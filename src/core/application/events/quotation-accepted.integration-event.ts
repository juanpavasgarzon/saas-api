import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type LineItemType } from '../../domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '../../domain/enums/unit-of-measure.enum';

export class QuotationAcceptedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'quotation.accepted';
  readonly eventName = QuotationAcceptedIntegrationEvent.eventName;

  constructor(
    public readonly quotationId: string,
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
