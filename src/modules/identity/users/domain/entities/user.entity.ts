import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { generateId } from '@shared/utils/uuid.util';

import { type UserProps } from '../contracts/user-props.contract';
import { UserRole } from '../enums/user-role.enum';
import { Email } from '../value-objects/email.value-object';

export class User extends AggregateRootBase {
  private _email: Email;
  private _passwordHash: string;
  private _role: UserRole;
  private _isActive: boolean;

  private constructor(props: UserProps) {
    super(props.id, props.tenantId);
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._role = props.role;
    this._isActive = props.isActive;
  }

  static create(
    tenantId: string,
    email: string,
    passwordHash: string,
    role: UserRole = UserRole.USER,
  ): User {
    return new User({
      id: generateId(),
      tenantId,
      email: new Email(email),
      passwordHash,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new ConflictError('User is already inactive');
    }
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('User is already active');
    }
    this._isActive = true;
    this.touch();
  }

  changeRole(role: UserRole): void {
    this._role = role;
    this.touch();
  }

  updatePassword(passwordHash: string): void {
    this._passwordHash = passwordHash;
    this.touch();
  }
}
