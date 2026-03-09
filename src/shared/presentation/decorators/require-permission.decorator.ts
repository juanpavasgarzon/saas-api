import { SetMetadata } from '@nestjs/common';

import { type Permission } from '../../domain/enums/permission.enum';

export const REQUIRE_PERMISSION_KEY = 'require_permission';

export const RequirePermission = (permission: Permission) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, permission);
