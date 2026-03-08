export class ReactivateWarehouseCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
