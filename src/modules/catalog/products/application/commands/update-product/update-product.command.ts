export class UpdateProductCommand {
  constructor(
    public readonly tenantId: string,
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly unit: string,
    public readonly category: string | null,
  ) {}
}
