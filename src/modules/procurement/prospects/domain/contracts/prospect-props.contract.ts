import { type SupplierProspectStatus } from '../enums/prospect-status.enum';

export interface IProspectProps {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  identificationNumber: string | null;
  address: string | null;
  contactPerson: string | null;
  notes: string | null;
  status: SupplierProspectStatus;
  createdAt: Date;
  updatedAt: Date;
}
