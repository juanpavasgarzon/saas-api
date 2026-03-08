export class RejectPurchaseRequestCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
