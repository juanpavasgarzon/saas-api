export interface ICreatePurchaseOrderService {
  createFromRequest(
    tenantId: string,
    purchaseRequestId: string,
    vendorId: string,
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>,
  ): Promise<void>;
}
