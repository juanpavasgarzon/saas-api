import { AppError } from '@core/domain/app-error.base';

export class InvitationExpiredError extends AppError {
  readonly statusCode = 410;
  readonly errorCode = 'INVITATION_EXPIRED';

  constructor() {
    super('This invitation has expired');
  }
}
