import { ConflictError } from '@shared/domain/errors/conflict.error';

export class AssetInvalidTransitionError extends ConflictError {
  constructor(from: string, to: string) {
    super(`Cannot transition asset from ${from} to ${to}`);
  }
}
