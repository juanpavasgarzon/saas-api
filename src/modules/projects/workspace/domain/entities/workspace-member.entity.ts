import { generateId } from '@utils/uuid.util';

import { type WorkspaceMemberProps } from '../contracts/workspace-member-props.contract';
import { WorkspaceMemberRole } from '../enums/workspace-member-role.enum';

export class WorkspaceMember {
  private readonly _id: string;
  private readonly _workspaceId: string;
  private readonly _tenantId: string;
  private readonly _employeeId: string;
  private _role: WorkspaceMemberRole;
  private readonly _joinedAt: Date;

  private constructor(props: WorkspaceMemberProps) {
    this._id = props.id;
    this._workspaceId = props.workspaceId;
    this._tenantId = props.tenantId;
    this._employeeId = props.employeeId;
    this._role = props.role;
    this._joinedAt = props.joinedAt;
  }

  static create(
    workspaceId: string,
    tenantId: string,
    employeeId: string,
    role: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER,
  ): WorkspaceMember {
    return new WorkspaceMember({
      id: generateId(),
      workspaceId,
      tenantId,
      employeeId,
      role,
      joinedAt: new Date(),
    });
  }

  static reconstitute(props: WorkspaceMemberProps): WorkspaceMember {
    return new WorkspaceMember(props);
  }

  get id(): string {
    return this._id;
  }

  get workspaceId(): string {
    return this._workspaceId;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get employeeId(): string {
    return this._employeeId;
  }

  get role(): WorkspaceMemberRole {
    return this._role;
  }

  get joinedAt(): Date {
    return this._joinedAt;
  }

  changeRole(role: WorkspaceMemberRole): void {
    this._role = role;
  }
}
