import { generateId } from '@shared/utils/uuid.util';

import { type ProjectMemberProps } from '../contracts/project-member-props.contract';
import { ProjectMemberRole } from '../enums/project-member-role.enum';

export class ProjectMember {
  private readonly _id: string;
  private readonly _projectId: string;
  private readonly _tenantId: string;
  private readonly _employeeId: string;
  private _role: ProjectMemberRole;
  private readonly _joinedAt: Date;

  private constructor(props: ProjectMemberProps) {
    this._id = props.id;
    this._projectId = props.projectId;
    this._tenantId = props.tenantId;
    this._employeeId = props.employeeId;
    this._role = props.role;
    this._joinedAt = props.joinedAt;
  }

  static create(
    projectId: string,
    tenantId: string,
    employeeId: string,
    role: ProjectMemberRole = ProjectMemberRole.MEMBER,
  ): ProjectMember {
    return new ProjectMember({
      id: generateId(),
      projectId,
      tenantId,
      employeeId,
      role,
      joinedAt: new Date(),
    });
  }

  static reconstitute(props: ProjectMemberProps): ProjectMember {
    return new ProjectMember(props);
  }

  get id(): string {
    return this._id;
  }

  get projectId(): string {
    return this._projectId;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get employeeId(): string {
    return this._employeeId;
  }

  get role(): ProjectMemberRole {
    return this._role;
  }

  get joinedAt(): Date {
    return this._joinedAt;
  }

  changeRole(role: ProjectMemberRole): void {
    this._role = role;
  }
}
