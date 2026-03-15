import { UnauthorizedError } from '@core/domain/errors/unauthorized.error';

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
