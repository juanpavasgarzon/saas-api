import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type LineItemType } from '../../domain/enums/line-item-type.enum';

export class QuotationRejectedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'quotation.rejected';
  readonly eventName = QuotationRejectedIntegrationEvent.eventName;

  constructor(
    public readonly quotationId: string,
    public readonly tenantId: string,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      quantity: number;
    }>,
  ) {}
}
