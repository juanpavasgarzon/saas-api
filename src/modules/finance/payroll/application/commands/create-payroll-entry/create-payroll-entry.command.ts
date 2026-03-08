import { type ICommand } from '@nestjs/cqrs';

export class CreatePayrollEntryCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly period: string,
    public readonly daysWorked: number,
    public readonly baseSalary: number,
    public readonly bonuses: number,
    public readonly deductions: number,
  ) {}
}
