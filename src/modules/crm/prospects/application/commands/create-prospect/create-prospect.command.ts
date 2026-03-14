import { type ProspectSource } from '../../../domain/enums/prospect-source.enum';

export class CreateProspectCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly company: string | null,
    public readonly identificationNumber: string | null,
    public readonly address: string | null,
    public readonly contactPerson: string | null,
    public readonly source: ProspectSource | null,
    public readonly notes: string | null,
  ) {}
}
