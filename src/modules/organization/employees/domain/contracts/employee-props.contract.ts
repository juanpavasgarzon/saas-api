import { type EmployeeStatus } from '../enums/employee-status.enum';

export interface EmployeeProps {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  hiredAt: Date;
  basicSalary: number;
  createdAt: Date;
  updatedAt: Date;
}
