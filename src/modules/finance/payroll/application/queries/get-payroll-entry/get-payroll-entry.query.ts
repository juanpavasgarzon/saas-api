export class GetPayrollEntryQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
