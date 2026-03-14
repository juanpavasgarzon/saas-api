export class GetInvoiceQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
