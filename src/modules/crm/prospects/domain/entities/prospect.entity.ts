import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type ProspectProps } from '../contracts/prospect-props.contract';
import { type ProspectSource } from '../enums/prospect-source.enum';
import { ProspectStatus } from '../enums/prospect-status.enum';

export class Prospect extends AggregateRootBase {
  private _name: string;
  private _email: string | null;
  private _phone: string | null;
  private _company: string | null;
  private _source: ProspectSource | null;
  private _status: ProspectStatus;
  private _notes: string | null;

  private constructor(props: ProspectProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._company = props.company;
    this._source = props.source;
    this._status = props.status;
    this._notes = props.notes;
  }

  static create(
    tenantId: string,
    name: string,
    email: string | null,
    phone: string | null,
    company: string | null,
    source: ProspectSource | null,
    notes: string | null,
  ): Prospect {
    return new Prospect({
      id: generateId(),
      tenantId,
      name,
      email,
      phone,
      company,
      source,
      status: ProspectStatus.NEW,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ProspectProps): Prospect {
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

  get source(): ProspectSource | null {
    return this._source;
  }

  get status(): ProspectStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  update(
    name: string,
    email: string | null,
    phone: string | null,
    company: string | null,
    source: ProspectSource | null,
    notes: string | null,
  ): void {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._company = company;
    this._source = source;
    this._notes = notes;
    this.touch();
  }

  updateStatus(status: ProspectStatus): void {
    this._status = status;
    this.touch();
  }
}
