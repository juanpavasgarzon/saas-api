export interface ServiceProps {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  unit: string;
  category: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
