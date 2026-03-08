import { ApiProperty } from '@nestjs/swagger';

import { type Employee } from '../../domain/entities/employee.entity';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

export class EmployeeResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ example: 'jane.doe@acme.com' })
  email: string;

  @ApiProperty({ example: 'Software Engineer' })
  position: string;

  @ApiProperty({ example: 'Engineering' })
  department: string;

  @ApiProperty({ enum: EmployeeStatus, example: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @ApiProperty({ example: '2024-03-01T00:00:00.000Z' })
  hiredAt: Date;

  @ApiProperty({ example: 5000 })
  basicSalary: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(employee: Employee) {
    this.id = employee.id;
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.fullName = employee.fullName;
    this.email = employee.email;
    this.position = employee.position;
    this.department = employee.department;
    this.status = employee.status;
    this.hiredAt = employee.hiredAt;
    this.basicSalary = employee.basicSalary;
    this.createdAt = employee.createdAt;
    this.updatedAt = employee.updatedAt;
  }
}
