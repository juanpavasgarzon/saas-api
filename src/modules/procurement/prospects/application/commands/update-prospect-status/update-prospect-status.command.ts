import { type SupplierProspectStatus } from '../../../domain/enums/prospect-status.enum';

export class UpdateProspectStatusCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly status: SupplierProspectStatus,
  ) {}
}
