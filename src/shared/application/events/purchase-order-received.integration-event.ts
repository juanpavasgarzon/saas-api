export class PurchaseOrderReceivedIntegrationEvent {
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
