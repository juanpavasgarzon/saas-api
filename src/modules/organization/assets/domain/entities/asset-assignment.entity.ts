import { generateId } from '@shared/utils/uuid.util';

import { type AssetAssignmentProps } from '../contracts/asset-assignment-props.contract';

export class AssetAssignment {
  private readonly _id: string;
  private readonly _assetId: string;
  private readonly _projectId: string | null;
  private readonly _employeeId: string | null;
  private readonly _assignedAt: Date;
  private _returnedAt: Date | null;

  private constructor(props: AssetAssignmentProps) {
    this._id = props.id;
    this._assetId = props.assetId;
    this._projectId = props.projectId;
    this._employeeId = props.employeeId;
    this._assignedAt = props.assignedAt;
    this._returnedAt = props.returnedAt;
  }

  static create(
    assetId: string,
    projectId: string | null,
    employeeId: string | null,
  ): AssetAssignment {
    return new AssetAssignment({
      id: generateId(),
      assetId,
      projectId,
      employeeId,
      assignedAt: new Date(),
      returnedAt: null,
    });
  }

  static reconstitute(props: AssetAssignmentProps): AssetAssignment {
    return new AssetAssignment(props);
  }

  get id(): string {
    return this._id;
  }
  get assetId(): string {
    return this._assetId;
  }
  get projectId(): string | null {
    return this._projectId;
  }
  get employeeId(): string | null {
    return this._employeeId;
  }
  get assignedAt(): Date {
    return this._assignedAt;
  }
  get returnedAt(): Date | null {
    return this._returnedAt;
  }
  get isActive(): boolean {
    return this._returnedAt === null;
  }

  markReturned(): void {
    this._returnedAt = new Date();
  }

  toProps(): AssetAssignmentProps {
    return {
      id: this._id,
      assetId: this._assetId,
      projectId: this._projectId,
      employeeId: this._employeeId,
      assignedAt: this._assignedAt,
      returnedAt: this._returnedAt,
    };
  }
}
