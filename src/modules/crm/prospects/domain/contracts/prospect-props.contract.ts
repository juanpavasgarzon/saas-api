import { type ProspectSource } from '../enums/prospect-source.enum';
import { type ProspectStatus } from '../enums/prospect-status.enum';

export interface ProspectProps {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  identificationNumber: string | null;
  address: string | null;
  contactPerson: string | null;
  source: ProspectSource | null;
  status: ProspectStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
