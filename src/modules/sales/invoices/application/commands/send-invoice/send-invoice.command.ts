export class SendInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
