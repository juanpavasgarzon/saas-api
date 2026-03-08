export interface WarehouseProps {
  id: string;
  tenantId: string;
  name: string;
  location: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
