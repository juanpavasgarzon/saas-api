import { NotFoundError } from '@core/domain/errors/not-found.error';

export class WorkspaceMemberNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('WorkspaceMember', id);
  }
}
