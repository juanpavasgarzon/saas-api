import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { generateId } from '@shared/utils/uuid.util';

import { type VendorProps } from '../contracts/vendor-props.contract';

export class Vendor extends AggregateRootBase {
  private _name: string;
  private _email: string;
  private _phone: string;
  private _company: string | null;
  private _identificationNumber: string;
  private _address: string;
  private _contactPerson: string | null;
  private _isActive: boolean;

  private constructor(props: VendorProps) {
    super(props.id, props.tenantId);

    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._company = props.company;
    this._identificationNumber = props.identificationNumber;
    this._address = props.address;
    this._contactPerson = props.contactPerson;
    this._isActive = props.isActive;
  }

  static create(
    tenantId: string,
    name: string,
    email: string,
    phone: string,
    identificationNumber: string,
    address: string,
    company: string | null,
    contactPerson: string | null,
  ): Vendor {
    return new Vendor({
      id: generateId(),
      tenantId,
      name,
      email: email.toLowerCase().trim(),
      phone,
      identificationNumber,
      address,
      company,
      contactPerson,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: VendorProps): Vendor {
    return new Vendor(props);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
  }

  get company() {
    return this._company;
  }

  get identificationNumber() {
    return this._identificationNumber;
  }

  get address() {
    return this._address;
  }

  get contactPerson() {
    return this._contactPerson;
  }

  get isActive() {
    return this._isActive;
  }

  update(
    name: string,
    email: string,
    phone: string,
    identificationNumber: string,
    address: string,
    company: string | null,
    contactPerson: string | null,
  ): void {
    this._name = name;
    this._email = email.toLowerCase().trim();
    this._phone = phone;
    this._identificationNumber = identificationNumber;
    this._address = address;
    this._company = company;
    this._contactPerson = contactPerson;

    this.touch();
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new ConflictError('Vendor is already inactive');
    }

    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('Vendor is already active');
    }

    this._isActive = true;
    this.touch();
  }
}
