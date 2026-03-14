import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type IProspectProps } from '../contracts/prospect-props.contract';
import { VendorProspectStatus } from '../enums/prospect-status.enum';

export class Prospect extends AggregateRootBase {
  private _name: string;
  private _email: string | null;
  private _phone: string | null;
  private _company: string | null;
  private _identificationNumber: string | null;
  private _address: string | null;
  private _contactPerson: string | null;
  private _notes: string | null;
  private _status: VendorProspectStatus;

  private constructor(props: IProspectProps) {
    super(props.id, props.tenantId);

    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._company = props.company;
    this._identificationNumber = props.identificationNumber;
    this._address = props.address;
    this._contactPerson = props.contactPerson;
    this._notes = props.notes;
    this._status = props.status;
  }

  static create(
    tenantId: string,
    name: string,
    email: string | null,
    phone: string | null,
    company: string | null,
    identificationNumber: string | null,
    address: string | null,
    contactPerson: string | null,
    notes: string | null,
  ): Prospect {
    return new Prospect({
      id: generateId(),
      tenantId,
      name,
      email,
      phone,
      company,
      identificationNumber,
      address,
      contactPerson,
      notes,
      status: VendorProspectStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: IProspectProps): Prospect {
    return new Prospect(props);
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

  get notes() {
    return this._notes;
  }

  get status() {
    return this._status;
  }

  update(
    name: string,
    email: string | null,
    phone: string | null,
    company: string | null,
    identificationNumber: string | null,
    address: string | null,
    contactPerson: string | null,
    notes: string | null,
  ): void {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._company = company;
    this._identificationNumber = identificationNumber;
    this._address = address;
    this._contactPerson = contactPerson;
    this._notes = notes;

    this.touch();
  }

  updateStatus(status: VendorProspectStatus): void {
    this._status = status;
    this.touch();
  }
}
