import { type RequisitionStatus } from '../../../domain/enums/requisition-status.enum';

export class ListRequisitionsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status: RequisitionStatus | undefined,
    public readonly supplierId: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
