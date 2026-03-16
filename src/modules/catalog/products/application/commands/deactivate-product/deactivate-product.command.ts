export class DeactivateProductCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
