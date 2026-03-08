export class CancelSaleCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
