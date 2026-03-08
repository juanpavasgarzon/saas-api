export interface StockProps {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
