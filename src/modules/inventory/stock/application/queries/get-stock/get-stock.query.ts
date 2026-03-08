export class GetStockQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
