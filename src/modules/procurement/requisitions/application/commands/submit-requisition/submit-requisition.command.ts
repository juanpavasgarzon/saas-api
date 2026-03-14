export class SubmitRequisitionCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
