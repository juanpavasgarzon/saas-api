import { type CompanyPlan } from '../enums/company-plan.enum';

export interface CompanyProps {
  id: string;
  name: string;
  slug: string;
  plan: CompanyPlan;
  logo: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
