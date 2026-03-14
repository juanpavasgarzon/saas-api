import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { type AuthUserData } from '../../application/contracts/auth-user-data.contract';
import { Permission } from '../../domain/enums/permission.enum';
import { ROLE_PERMISSIONS } from '../../domain/enums/role-permissions';
import { UserRole } from '../../domain/enums/user-role.enum';
import { REQUIRE_PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<Permission | undefined>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUserData;
    if (!user) {
      throw new ForbiddenException();
    }

    const role = user.role as UserRole;
    const allowed = ROLE_PERMISSIONS[role] ?? [];
    if (!allowed.includes(permission)) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    return true;
  }
}
