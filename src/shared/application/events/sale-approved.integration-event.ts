export class SaleApprovedIntegrationEvent {
  constructor(
    public readonly saleId: string,
    public readonly tenantId: string,
    public readonly items: Array<{
      productId: string | null;
      description: string;
      quantity: number;
    }>,
  ) {}
}
