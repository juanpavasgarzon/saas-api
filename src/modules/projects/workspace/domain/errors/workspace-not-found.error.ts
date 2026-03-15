import { NotFoundError } from '@core/domain/errors/not-found.error';

export class WorkspaceNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Workspace', id);
  }
}
