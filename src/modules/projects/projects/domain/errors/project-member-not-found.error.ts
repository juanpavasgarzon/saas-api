import { NotFoundError } from '@shared/domain/errors/not-found.error';

export class ProjectMemberNotFoundError extends NotFoundError {
  constructor(employeeId: string) {
    super('ProjectMember', employeeId);
  }
}
