export class ReactivateProductCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
