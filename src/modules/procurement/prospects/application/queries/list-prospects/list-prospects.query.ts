import { type SupplierProspectStatus } from '../../../domain/enums/prospect-status.enum';

export class ListProspectsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: { status?: SupplierProspectStatus; search?: string },
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
