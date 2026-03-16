export class CreateProductCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly sku: string,
    public readonly description: string | null,
    public readonly unit: string,
    public readonly category: string | null,
  ) {}
}
