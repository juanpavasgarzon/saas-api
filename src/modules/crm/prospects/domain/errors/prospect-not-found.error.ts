import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class ProspectNotFoundError extends NotFoundError {
  constructor() {
    super('Prospect', 'unknown');
  }
}
