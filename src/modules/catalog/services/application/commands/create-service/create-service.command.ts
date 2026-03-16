export class CreateServiceCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly unit: string,
    public readonly category: string | null,
  ) {}
}
