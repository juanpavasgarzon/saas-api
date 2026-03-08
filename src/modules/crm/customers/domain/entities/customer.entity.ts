import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { generateId } from '@shared/utils/uuid.util';

import { type CustomerProps } from '../contracts/customer-props.contract';

export class Customer extends AggregateRootBase {
  private _name: string;
  private _email: string;
  private _phone: string;
  private _address: string;
  private _contactPerson: string;
  private _isActive: boolean;

  private constructor(props: CustomerProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._contactPerson = props.contactPerson;
    this._isActive = props.isActive;
  }

  static create(
    tenantId: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    contactPerson: string,
  ): Customer {
    return new Customer({
      id: generateId(),
      tenantId,
      name,
      email: email.toLowerCase().trim(),
      phone,
      address,
      contactPerson,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  get contactPerson(): string {
    return this._contactPerson;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  update(name: string, email: string, phone: string, address: string, contactPerson: string): void {
    this._name = name;
    this._email = email.toLowerCase().trim();
    this._phone = phone;
    this._address = address;
    this._contactPerson = contactPerson;
    this.touch();
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new ConflictError('Customer is already inactive');
    }
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('Customer is already active');
    }
    this._isActive = true;
    this.touch();
  }

  static createFromProspect(
    prospectId: string,
    tenantId: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    contactPerson: string,
  ): Customer {
    return new Customer({
      id: prospectId,
      tenantId,
      name,
      email: email.toLowerCase().trim(),
      phone,
      address,
      contactPerson,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
