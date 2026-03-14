import { NotFoundError } from '@core/domain/errors/not-found.error';

export class AssetNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Asset', id);
  }
}
