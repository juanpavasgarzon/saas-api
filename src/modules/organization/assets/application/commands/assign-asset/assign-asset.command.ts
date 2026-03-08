export class AssignAssetCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly projectId: string | null,
    public readonly employeeId: string | null,
  ) {}
}
