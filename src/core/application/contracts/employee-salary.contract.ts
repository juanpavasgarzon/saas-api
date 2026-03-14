export interface IEmployeeSalaryService {
  getBasicSalary(employeeId: string, tenantId: string): Promise<number | null>;
}
