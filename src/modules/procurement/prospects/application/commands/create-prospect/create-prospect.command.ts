export class CreateProspectCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly company: string | null,
    public readonly notes: string | null,
  ) {}
}
