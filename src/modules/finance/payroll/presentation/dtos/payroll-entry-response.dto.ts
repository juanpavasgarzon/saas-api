import { ApiProperty } from '@nestjs/swagger';

import { type PayrollEntry } from '../../domain/entities/payroll-entry.entity';
import { PayrollStatus } from '../../domain/enums/payroll-status.enum';

export class PayrollEntryResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  employeeId: string;

  @ApiProperty({ example: '2025-03' })
  period: string;

  @ApiProperty({ example: 22 })
  daysWorked: number;

  @ApiProperty({ example: 5000 })
  baseSalary: number;

  @ApiProperty({ example: 500 })
  bonuses: number;

  @ApiProperty({ example: 200 })
  deductions: number;

  @ApiProperty({ example: 5300 })
  netPay: number;

  @ApiProperty({ enum: PayrollStatus, example: PayrollStatus.PENDING })
  status: PayrollStatus;

  @ApiProperty({ example: null, nullable: true })
  paidAt: Date | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(entry: PayrollEntry) {
    this.id = entry.id;
    this.employeeId = entry.employeeId;
    this.period = entry.period;
    this.daysWorked = entry.daysWorked;
    this.baseSalary = entry.baseSalary;
    this.bonuses = entry.bonuses;
    this.deductions = entry.deductions;
    this.netPay = entry.netPay;
    this.status = entry.status;
    this.paidAt = entry.paidAt;
    this.createdAt = entry.createdAt;
    this.updatedAt = entry.updatedAt;
  }
}
