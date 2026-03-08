import { type UserRole } from '../enums/user-role.enum';
import { type Email } from '../value-objects/email.value-object';

export interface UserProps {
  id: string;
  tenantId: string;
  email: Email;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
