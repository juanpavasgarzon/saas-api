import { UnauthorizedError } from '@shared/domain/errors/unauthorized.error';

export class UserInactiveError extends UnauthorizedError {
  constructor() {
    super('User account is inactive');
  }
}
