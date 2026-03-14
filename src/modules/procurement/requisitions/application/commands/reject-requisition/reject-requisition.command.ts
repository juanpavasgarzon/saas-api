export class RejectRequisitionCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
