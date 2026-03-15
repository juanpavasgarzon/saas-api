import { generateId } from '@utils/uuid.util';

import { type InvitationProps } from '../contracts/invitation-props.contract';
import { InvitationStatus } from '../enums/invitation-status.enum';

const EXPIRATION_DAYS = 7;

export class Invitation {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _email: string;
  private readonly _role: string;
  private _token: string;
  private readonly _url: string;
  private _status: InvitationStatus;
  private _expiresAt: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: InvitationProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._email = props.email;
    this._role = props.role;
    this._token = props.token;
    this._url = props.url;
    this._status = props.status;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(tenantId: string, email: string, role: string, url: string): Invitation {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPIRATION_DAYS);

    return new Invitation({
      id: generateId(),
      tenantId,
      email: email.toLowerCase().trim(),
      role,
      token: generateId(),
      url,
      status: InvitationStatus.PENDING,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: InvitationProps): Invitation {
    return new Invitation(props);
  }

  get id(): string {
    return this._id;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get email(): string {
    return this._email;
  }

  get role(): string {
    return this._role;
  }

  get token(): string {
    return this._token;
  }

  get url(): string {
    return this._url;
  }

  get status(): InvitationStatus {
    return this._status;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  accept(): void {
    this._status = InvitationStatus.ACCEPTED;
    this._updatedAt = new Date();
  }

  expire(): void {
    this._status = InvitationStatus.EXPIRED;
    this._updatedAt = new Date();
  }

  resend(): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPIRATION_DAYS);

    this._token = generateId();
    this._expiresAt = expiresAt;
    this._status = InvitationStatus.PENDING;
    this._updatedAt = new Date();
  }
}
