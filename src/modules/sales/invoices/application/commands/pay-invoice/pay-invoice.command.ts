export class PayInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
