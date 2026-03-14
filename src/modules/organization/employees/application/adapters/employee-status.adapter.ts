import { Inject, Injectable } from '@nestjs/common';

import { type IEmployeeStatusService } from '@modules/organization/shared/contracts/employee-status.contract';

import { type IEmployeeRepository } from '../../domain/contracts/employee-repository.contract';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';
import { EMPLOYEE_REPOSITORY } from '../../domain/tokens/employee-repository.token';

@Injectable()
export class EmployeeStatusAdapter implements IEmployeeStatusService {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async isActive(employeeId: string, tenantId: string): Promise<boolean> {
    const employee = await this.employeeRepository.findById(employeeId, tenantId);
    return employee?.status === EmployeeStatus.ACTIVE;
  }
}
