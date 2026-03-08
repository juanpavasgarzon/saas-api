import { ConflictError } from '@shared/domain/errors/conflict.error';

export class AssetRetiredError extends ConflictError {
  constructor() {
    super('Asset is retired and cannot be assigned');
  }
}
