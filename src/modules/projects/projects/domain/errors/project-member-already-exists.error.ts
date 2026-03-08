import { ConflictError } from '@shared/domain/errors/conflict.error';

export class ProjectMemberAlreadyExistsError extends ConflictError {
  constructor(employeeId: string, projectId: string) {
    super(`Employee "${employeeId}" is already a member of project "${projectId}"`);
  }
}
