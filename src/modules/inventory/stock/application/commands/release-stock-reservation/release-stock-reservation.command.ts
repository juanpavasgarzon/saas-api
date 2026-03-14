export class ReleaseStockReservationCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
