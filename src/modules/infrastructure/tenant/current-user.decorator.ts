import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUserData;
    return user;
  },
);
