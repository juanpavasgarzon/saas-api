export class ReactivateEmployeeCommand {
  constructor(
    public readonly employeeId: string,
    public readonly tenantId: string,
  ) {}
}
