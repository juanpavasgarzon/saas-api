export interface PurchaseOrderItemProps {
  id: string;
  purchaseOrderId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
