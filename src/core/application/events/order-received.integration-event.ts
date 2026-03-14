import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type LineItemType } from '../../domain/enums/line-item-type.enum';

export class OrderReceivedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'order.received';
  readonly eventName = OrderReceivedIntegrationEvent.eventName;

  constructor(
    public readonly orderId: string,
    public readonly tenantId: string,
    public readonly supplierId: string,
    public readonly total: number,
    public readonly items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
  ) {}
}
