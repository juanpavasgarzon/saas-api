import { type PayrollEntry } from '@modules/finance/payroll/domain/entities/payroll-entry.entity';

export interface IPayrollPdfService {
  generate(entry: PayrollEntry, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
