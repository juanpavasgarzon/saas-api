import { NotFoundError } from '@core/domain/errors/not-found.error';

export class ProjectMemberNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('ProjectMember', id);
  }
}
