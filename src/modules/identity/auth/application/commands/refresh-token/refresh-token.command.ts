import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';

export class RefreshTokenCommand {
  constructor(public readonly user: AuthUserData) {}
}
