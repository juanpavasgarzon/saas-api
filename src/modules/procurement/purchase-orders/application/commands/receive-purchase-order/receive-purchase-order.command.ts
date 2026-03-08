export class ReceivePurchaseOrderCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
