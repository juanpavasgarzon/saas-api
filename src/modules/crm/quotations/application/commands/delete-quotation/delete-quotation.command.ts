export class DeleteQuotationCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
