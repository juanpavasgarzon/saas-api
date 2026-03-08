export class CancelPurchaseOrderCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
