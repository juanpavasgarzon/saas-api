export interface IEmployeeStatusService {
  isActive(employeeId: string, tenantId: string): Promise<boolean>;
}
