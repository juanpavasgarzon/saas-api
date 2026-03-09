import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type IProspectProps } from '../contracts/prospect-props.contract';
import { VendorProspectStatus } from '../enums/prospect-status.enum';

export class Prospect extends AggregateRootBase {
  private _name: string;
  private _email: string | null;
  private _phone: string | null;
  private _company: string | null;
  private _notes: string | null;
  private _status: VendorProspectStatus;

  private constructor(props: IProspectProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._company = props.company;
    this._notes = props.notes;
    this._status = props.status;
  }

  static create(
    tenantId: string,
    name: string,
    email: string | null,
    phone: string | null,
    company: string | null,
    notes: string | null,
  ): Prospect {
    return new Prospect({
      id: generateId(),
      tenantId,
      name,
      email,
      phone,
      company,
      notes,
      status: VendorProspectStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: IProspectProps): Prospect {
    return new Prospect(props);
  }

  get name(): string {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get phone(): string | null {
    return this._phone;
  }

  get company(): string | null {
    return this._company;
  }

  get notes(): string | null {
    return this._notes;
  }

  get status(): VendorProspectStatus {
    return this._status;
  }

  updateStatus(status: VendorProspectStatus): void {
    this._status = status;
    this.touch();
  }
}
