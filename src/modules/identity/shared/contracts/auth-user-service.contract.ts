import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';

export interface IAuthUserService {
  createUser(tenantId: string, email: string, password: string, role?: string): Promise<string>;
  validateCredentials(email: string, password: string): Promise<AuthUserData | null>;
  getUserById(id: string): Promise<AuthUserData | null>;
}
