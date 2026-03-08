import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class ProjectNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Project', id);
  }
}
