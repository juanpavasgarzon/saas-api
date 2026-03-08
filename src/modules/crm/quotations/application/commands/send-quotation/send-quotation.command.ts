export class SendQuotationCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
