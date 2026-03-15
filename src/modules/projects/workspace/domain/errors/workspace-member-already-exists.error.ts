import { ConflictError } from '@core/domain/errors/conflict.error';

export class WorkspaceMemberAlreadyExistsError extends ConflictError {
  constructor(employeeId: string, workspaceId: string) {
    super(`Employee "${employeeId}" is already a member of workspace "${workspaceId}"`);
  }
}
