import { UnauthorizedError } from '@core/domain/errors/unauthorized.error';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Invalid email or password');
  }
}
