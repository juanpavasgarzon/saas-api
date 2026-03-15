import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { generateId } from '@utils/uuid.util';

import { type WorkspaceProps } from '../contracts/workspace-props.contract';
import { WorkspaceMemberRole } from '../enums/workspace-member-role.enum';
import { WorkspaceStatus } from '../enums/workspace-status.enum';
import {
  InvalidWorkspaceStatusTransitionError,
  WorkspaceMemberAlreadyExistsError,
  WorkspaceMemberNotFoundError,
} from '../errors/workspace.errors';
import { WorkspaceMember } from './workspace-member.entity';

export class Workspace extends AggregateRootBase {
  private _name: string;
  private _description: string;
  private _customerId: string;
  private _status: WorkspaceStatus;
  private _budget: number | null;
  private _startDate: Date | null;
  private _endDate: Date | null;
  private _members: WorkspaceMember[];

  private constructor(props: WorkspaceProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._description = props.description;
    this._customerId = props.customerId;
    this._status = props.status;
    this._budget = props.budget;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._members = props.members;
  }

  static create(
    tenantId: string,
    name: string,
    description: string,
    customerId: string,
    budget?: number,
    startDate?: Date,
    endDate?: Date,
  ): Workspace {
    return new Workspace({
      id: generateId(),
      tenantId,
      name,
      description,
      customerId,
      status: WorkspaceStatus.PLANNING,
      budget: budget ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: WorkspaceProps): Workspace {
    return new Workspace(props);
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): WorkspaceStatus {
    return this._status;
  }

  get budget(): number | null {
    return this._budget;
  }

  get startDate(): Date | null {
    return this._startDate;
  }

  get endDate(): Date | null {
    return this._endDate;
  }

  get members(): WorkspaceMember[] {
    return [...this._members];
  }

  update(
    name: string,
    description: string,
    budget: number | null,
    startDate: Date | null,
    endDate: Date | null,
  ): void {
    this._name = name;
    this._description = description;
    this._budget = budget;
    this._startDate = startDate;
    this._endDate = endDate;
    this.touch();
  }

  activate(): void {
    if (this._status !== WorkspaceStatus.PLANNING && this._status !== WorkspaceStatus.ON_HOLD) {
      throw new InvalidWorkspaceStatusTransitionError(this._status, WorkspaceStatus.ACTIVE);
    }

    this._status = WorkspaceStatus.ACTIVE;
    this.touch();
  }

  putOnHold(): void {
    if (this._status !== WorkspaceStatus.ACTIVE) {
      throw new InvalidWorkspaceStatusTransitionError(this._status, WorkspaceStatus.ON_HOLD);
    }

    this._status = WorkspaceStatus.ON_HOLD;
    this.touch();
  }

  complete(): void {
    if (this._status !== WorkspaceStatus.ACTIVE) {
      throw new InvalidWorkspaceStatusTransitionError(this._status, WorkspaceStatus.COMPLETED);
    }

    this._status = WorkspaceStatus.COMPLETED;
    this.touch();
  }

  cancel(): void {
    if (this._status === WorkspaceStatus.COMPLETED) {
      throw new InvalidWorkspaceStatusTransitionError(this._status, WorkspaceStatus.CANCELLED);
    }

    this._status = WorkspaceStatus.CANCELLED;
    this.touch();
  }

  addMember(employeeId: string, role: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER): WorkspaceMember {
    const exists = this._members.some((m) => m.employeeId === employeeId);
    if (exists) {
      throw new WorkspaceMemberAlreadyExistsError(employeeId, this._id);
    }

    const member = WorkspaceMember.create(this._id, this._tenantId, employeeId, role);
    this._members.push(member);
    this.touch();

    return member;
  }

  removeMember(employeeId: string): void {
    const index = this._members.findIndex((m) => m.employeeId === employeeId);
    if (index === -1) {
      throw new WorkspaceMemberNotFoundError(employeeId);
    }

    this._members.splice(index, 1);
    this.touch();
  }

  hasMember(employeeId: string): boolean {
    return this._members.some((m) => m.employeeId === employeeId);
  }
}
