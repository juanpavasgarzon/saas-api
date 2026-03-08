export class SubmitPurchaseRequestCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
