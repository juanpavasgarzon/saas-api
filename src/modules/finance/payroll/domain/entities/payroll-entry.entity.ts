import { generateId } from '@utils/uuid.util';

import { type PayrollEntryProps } from '../contracts/payroll-entry-props.contract';
import { PayrollStatus } from '../enums/payroll-status.enum';

export class PayrollEntry {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _employeeId: string;
  private readonly _period: string;
  private readonly _daysWorked: number;
  private readonly _baseSalary: number;
  private _bonuses: number;
  private _deductions: number;
  private _netPay: number;
  private _status: PayrollStatus;
  private _paidAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PayrollEntryProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._employeeId = props.employeeId;
    this._period = props.period;
    this._daysWorked = props.daysWorked;
    this._baseSalary = props.baseSalary;
    this._bonuses = props.bonuses;
    this._deductions = props.deductions;
    this._netPay = props.netPay;
    this._status = props.status;
    this._paidAt = props.paidAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    tenantId: string,
    employeeId: string,
    period: string,
    daysWorked: number,
    baseSalary: number,
    bonuses = 0,
    deductions = 0,
  ): PayrollEntry {
    const netPay = baseSalary + bonuses - deductions;

    return new PayrollEntry({
      id: generateId(),
      tenantId,
      employeeId,
      period,
      daysWorked,
      baseSalary,
      bonuses,
      deductions,
      netPay,
      status: PayrollStatus.PENDING,
      paidAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: PayrollEntryProps): PayrollEntry {
    return new PayrollEntry(props);
  }

  get id(): string {
    return this._id;
  }
  get tenantId(): string {
    return this._tenantId;
  }
  get employeeId(): string {
    return this._employeeId;
  }
  get period(): string {
    return this._period;
  }
  get daysWorked(): number {
    return this._daysWorked;
  }
  get baseSalary(): number {
    return this._baseSalary;
  }
  get bonuses(): number {
    return this._bonuses;
  }
  get deductions(): number {
    return this._deductions;
  }
  get netPay(): number {
    return this._netPay;
  }
  get status(): PayrollStatus {
    return this._status;
  }
  get paidAt(): Date | null {
    return this._paidAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsPaid(): void {
    this._status = PayrollStatus.PAID;
    this._paidAt = new Date();
    this._updatedAt = new Date();
  }
}
