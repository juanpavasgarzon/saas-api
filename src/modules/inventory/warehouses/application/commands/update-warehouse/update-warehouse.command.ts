export class UpdateWarehouseCommand {
  constructor(
    public readonly tenantId: string,
    public readonly id: string,
    public readonly name: string,
    public readonly location: string | null,
  ) {}
}
