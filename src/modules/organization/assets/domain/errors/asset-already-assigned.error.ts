import { ConflictError } from '@shared/domain/errors/conflict.error';

export class AssetAlreadyAssignedError extends ConflictError {
  constructor() {
    super('Asset is already assigned');
  }
}
