export class CreatePurchaseRequestCommand {
  constructor(
    public readonly tenantId: string,
    public readonly title: string,
    public readonly vendorId: string | null,
    public readonly vendorProspectId: string | null,
    public readonly notes: string | null,
    public readonly items: Array<{ description: string; quantity: number; unitPrice: number }>,
  ) {}
}
