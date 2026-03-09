import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';

export class PurchaseOrderReceivedIntegrationEvent implements IntegrationEvent {
  static readonly eventName = 'purchase-order.received';
  readonly eventName = PurchaseOrderReceivedIntegrationEvent.eventName;

  constructor(
    public readonly purchaseOrderId: string,
    public readonly tenantId: string,
    public readonly items: Array<{
      productId: string | null;
      description: string;
      quantity: number;
    }>,
  ) {}
}
