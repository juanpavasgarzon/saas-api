export class ProspectConvertedEvent {
  constructor(
    public readonly prospectId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly identificationNumber: string | null,
    public readonly address: string | null,
    public readonly company: string | null,
    public readonly contactPerson: string | null,
  ) {}
}
