import { type PurchaseOrderStatus } from '../../../domain/enums/purchase-order-status.enum';

export class ListPurchaseOrdersQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status: PurchaseOrderStatus | undefined,
    public readonly vendorId: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
