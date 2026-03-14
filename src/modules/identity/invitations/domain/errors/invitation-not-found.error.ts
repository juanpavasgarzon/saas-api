import { NotFoundError } from '@core/domain/errors/not-found.error';

export class InvitationNotFoundError extends NotFoundError {
  constructor(token: string) {
    super('Invitation', token);
  }
}
