import { ConflictError } from '@core/domain/errors/conflict.error';

export class AssetAlreadyAssignedError extends ConflictError {
  constructor() {
    super('Asset is already assigned');
  }
}
