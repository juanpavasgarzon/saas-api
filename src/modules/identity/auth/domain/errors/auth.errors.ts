import { UnauthorizedError } from '@shared/index';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Invalid email or password');
  }
}

export class UserInactiveError extends UnauthorizedError {
  constructor() {
    super('User account is inactive');
  }
}
