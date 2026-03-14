import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { ConflictError } from '@core/domain/errors/conflict.error';
import { generateId } from '@utils/uuid.util';

import { type EmployeeProps } from '../contracts/employee-props.contract';
import { EmployeeStatus } from '../enums/employee-status.enum';

export class Employee extends AggregateRootBase {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _position: string;
  private _department: string;
  private _status: EmployeeStatus;
  private _hiredAt: Date;
  private _basicSalary: number;

  private constructor(props: EmployeeProps) {
    super(props.id, props.tenantId);
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._position = props.position;
    this._department = props.department;
    this._status = props.status;
    this._hiredAt = props.hiredAt;
    this._basicSalary = props.basicSalary;
  }

  static create(
    tenantId: string,
    firstName: string,
    lastName: string,
    email: string,
    position: string,
    department: string,
    hiredAt: Date,
    basicSalary: number,
  ): Employee {
    return new Employee({
      id: generateId(),
      tenantId,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      position,
      department,
      status: EmployeeStatus.ACTIVE,
      hiredAt,
      basicSalary,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: EmployeeProps): Employee {
    return new Employee(props);
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get email(): string {
    return this._email;
  }

  get position(): string {
    return this._position;
  }

  get department(): string {
    return this._department;
  }

  get status(): EmployeeStatus {
    return this._status;
  }

  get hiredAt(): Date {
    return this._hiredAt;
  }

  get basicSalary(): number {
    return this._basicSalary;
  }

  update(
    firstName: string,
    lastName: string,
    email: string,
    position: string,
    department: string,
    basicSalary: number,
  ): void {
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email.toLowerCase().trim();
    this._position = position;
    this._department = department;
    this._basicSalary = basicSalary;
    this.touch();
  }

  deactivate(): void {
    if (this._status === EmployeeStatus.INACTIVE) {
      throw new ConflictError('Employee is already inactive');
    }
    this._status = EmployeeStatus.INACTIVE;
    this.touch();
  }

  setOnLeave(): void {
    this._status = EmployeeStatus.ON_LEAVE;
    this.touch();
  }

  activate(): void {
    if (this._status === EmployeeStatus.ACTIVE) {
      throw new ConflictError('Employee is already active');
    }
    this._status = EmployeeStatus.ACTIVE;
    this.touch();
  }
}
