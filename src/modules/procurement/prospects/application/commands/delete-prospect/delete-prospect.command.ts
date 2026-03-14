export class DeleteProspectCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
