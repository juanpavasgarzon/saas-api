export class ExpireQuotationCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
