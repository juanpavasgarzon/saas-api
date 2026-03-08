import { Injectable } from '@nestjs/common';

import { AuthUserData } from '@shared/application/contracts/auth-user-data.contract';
import { IAuthUserService } from '@modules/identity/shared/contracts/auth-user-service.contract';

import { UserRole } from '../../domain/enums/user-role.enum';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthUserAdapter implements IAuthUserService {
  constructor(private readonly userService: UserService) {}

  createUser(tenantId: string, email: string, password: string, role?: string): Promise<string> {
    return this.userService.createUser(
      tenantId,
      email,
      password,
      (role as UserRole) ?? UserRole.USER,
    );
  }

  async validateCredentials(email: string, password: string): Promise<AuthUserData | null> {
    const user = await this.userService.validateCredentials(email, password);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email.value,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async getUserById(id: string): Promise<AuthUserData | null> {
    try {
      const user = await this.userService.getUserById(id);

      return {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email.value,
        role: user.role,
        isActive: user.isActive,
      };
    } catch {
      return null;
    }
  }
}
