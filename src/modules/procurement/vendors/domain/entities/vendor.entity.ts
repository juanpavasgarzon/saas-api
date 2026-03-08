import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type VendorProps } from '../contracts/vendor-props.contract';

export class Vendor extends AggregateRootBase {
  private _name: string;
  private _email: string;
  private _phone: string;
  private _address: string;
  private _contactPerson: string;
  private _isActive: boolean;

  private constructor(props: VendorProps) {
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
  ): Vendor {
    return new Vendor({
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

  static reconstitute(props: VendorProps): Vendor {
    return new Vendor(props);
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

  update(name: string, phone: string, address: string, contactPerson: string): void {
    this._name = name;
    this._phone = phone;
    this._address = address;
    this._contactPerson = contactPerson;
    this.touch();
  }

  deactivate(): void {
    this._isActive = false;
    this.touch();
  }
}
