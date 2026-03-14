import { Inject, Injectable } from '@nestjs/common';

import { type IEmployeeSalaryService } from '@core/application/contracts/employee-salary.contract';

import { type IEmployeeRepository } from '../../domain/contracts/employee-repository.contract';
import { EMPLOYEE_REPOSITORY } from '../../domain/tokens/employee-repository.token';

@Injectable()
export class EmployeeSalaryAdapter implements IEmployeeSalaryService {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async getBasicSalary(employeeId: string, tenantId: string): Promise<number | null> {
    const employee = await this.employeeRepository.findById(employeeId, tenantId);
    return employee?.basicSalary ?? null;
  }
}
