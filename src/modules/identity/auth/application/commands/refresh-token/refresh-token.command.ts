import { type AuthUserData } from '@core/application/contracts/auth-user-data.contract';

export class RefreshTokenCommand {
  constructor(public readonly user: AuthUserData) {}
}
