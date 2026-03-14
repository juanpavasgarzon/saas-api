export interface VendorProps {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  identificationNumber: string;
  address: string;
  contactPerson: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
