import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type LineItemType } from '../../domain/enums/line-item-type.enum';

export class QuotationExpiredIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'quotation.expired';
  readonly eventName = QuotationExpiredIntegrationEvent.eventName;

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
