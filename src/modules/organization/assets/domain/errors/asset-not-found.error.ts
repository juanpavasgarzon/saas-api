import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class AssetNotFoundError extends NotFoundError {
  constructor() {
    super('Asset', 'unknown');
  }
}
