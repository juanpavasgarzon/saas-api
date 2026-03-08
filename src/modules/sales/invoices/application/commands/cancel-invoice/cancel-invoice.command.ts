export class CancelInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
