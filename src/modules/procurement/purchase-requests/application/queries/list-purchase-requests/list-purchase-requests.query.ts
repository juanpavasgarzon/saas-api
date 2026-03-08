import { type PurchaseRequestStatus } from '../../../domain/enums/purchase-request-status.enum';

export class ListPurchaseRequestsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status: PurchaseRequestStatus | undefined,
    public readonly vendorId: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
