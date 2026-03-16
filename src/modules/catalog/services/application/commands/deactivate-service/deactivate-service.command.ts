export class DeactivateServiceCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
