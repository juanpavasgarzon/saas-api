import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { generateId } from '@utils/uuid.util';

import { type ProjectProps } from '../contracts/workspace-props.contract';
import { ProjectMemberRole } from '../enums/workspace-member-role.enum';
import { ProjectStatus } from '../enums/workspace-status.enum';
import {
  InvalidProjectStatusTransitionError,
  ProjectMemberAlreadyExistsError,
  ProjectMemberNotFoundError,
} from '../errors/workspace.errors';
import { ProjectMember } from './workspace-member.entity';

export class Project extends AggregateRootBase {
  private _name: string;
  private _description: string;
  private _customerId: string;
  private _status: ProjectStatus;
  private _budget: number | null;
  private _startDate: Date | null;
  private _endDate: Date | null;
  private _members: ProjectMember[];

  private constructor(props: ProjectProps) {
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
  ): Project {
    return new Project({
      id: generateId(),
      tenantId,
      name,
      description,
      customerId,
      status: ProjectStatus.PLANNING,
      budget: budget ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ProjectProps): Project {
    return new Project(props);
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

  get status(): ProjectStatus {
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

  get members(): ProjectMember[] {
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
    if (this._status !== ProjectStatus.PLANNING && this._status !== ProjectStatus.ON_HOLD) {
      throw new InvalidProjectStatusTransitionError(this._status, ProjectStatus.ACTIVE);
    }

    this._status = ProjectStatus.ACTIVE;
    this.touch();
  }

  putOnHold(): void {
    if (this._status !== ProjectStatus.ACTIVE) {
      throw new InvalidProjectStatusTransitionError(this._status, ProjectStatus.ON_HOLD);
    }

    this._status = ProjectStatus.ON_HOLD;
    this.touch();
  }

  complete(): void {
    if (this._status !== ProjectStatus.ACTIVE) {
      throw new InvalidProjectStatusTransitionError(this._status, ProjectStatus.COMPLETED);
    }

    this._status = ProjectStatus.COMPLETED;
    this.touch();
  }

  cancel(): void {
    if (this._status === ProjectStatus.COMPLETED) {
      throw new InvalidProjectStatusTransitionError(this._status, ProjectStatus.CANCELLED);
    }

    this._status = ProjectStatus.CANCELLED;
    this.touch();
  }

  addMember(employeeId: string, role: ProjectMemberRole = ProjectMemberRole.MEMBER): ProjectMember {
    const exists = this._members.some((m) => m.employeeId === employeeId);
    if (exists) {
      throw new ProjectMemberAlreadyExistsError(employeeId, this._id);
    }

    const member = ProjectMember.create(this._id, this._tenantId, employeeId, role);
    this._members.push(member);
    this.touch();

    return member;
  }

  removeMember(employeeId: string): void {
    const index = this._members.findIndex((m) => m.employeeId === employeeId);
    if (index === -1) {
      throw new ProjectMemberNotFoundError(employeeId);
    }

    this._members.splice(index, 1);
    this.touch();
  }

  hasMember(employeeId: string): boolean {
    return this._members.some((m) => m.employeeId === employeeId);
  }
}
