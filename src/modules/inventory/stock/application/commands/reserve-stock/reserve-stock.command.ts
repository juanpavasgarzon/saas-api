export class ReserveStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly referenceId: string,
  ) {}
}
