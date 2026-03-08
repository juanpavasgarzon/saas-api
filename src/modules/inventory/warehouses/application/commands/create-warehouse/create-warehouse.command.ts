export class CreateWarehouseCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly location: string | null,
  ) {}
}
