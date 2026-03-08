import { type PayrollStatus } from '../enums/payroll-status.enum';

export interface PayrollEntryProps {
  id: string;
  tenantId: string;
  employeeId: string;
  period: string;
  daysWorked: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
