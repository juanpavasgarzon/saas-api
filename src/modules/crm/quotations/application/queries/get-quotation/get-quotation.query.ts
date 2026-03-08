export class GetQuotationQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
