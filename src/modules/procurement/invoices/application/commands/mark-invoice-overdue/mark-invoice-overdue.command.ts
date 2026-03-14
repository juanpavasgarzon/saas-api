export class MarkInvoiceOverdueCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
