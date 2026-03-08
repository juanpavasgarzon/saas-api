export interface ProductProps {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  description: string | null;
  unit: string;
  category: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
