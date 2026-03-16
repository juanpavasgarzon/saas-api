export class ReactivateServiceCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
