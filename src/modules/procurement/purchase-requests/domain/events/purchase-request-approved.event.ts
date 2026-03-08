export class PurchaseRequestApprovedEvent {
  constructor(
    public readonly purchaseRequestId: string,
    public readonly tenantId: string,
    public readonly vendorId: string | null,
    public readonly vendorProspectId: string | null,
    public readonly items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>,
  ) {}
}
