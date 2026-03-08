export class RejectQuotationCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
