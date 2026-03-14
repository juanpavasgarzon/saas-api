import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { generateId } from '@utils/uuid.util';

import { type AssetProps } from '../contracts/asset-props.contract';
import { type AssetCategory } from '../enums/asset-category.enum';
import { AssetStatus } from '../enums/asset-status.enum';
import { AssetAlreadyAssignedError } from '../errors/asset-already-assigned.error';
import { AssetInvalidTransitionError } from '../errors/asset-invalid-transition.error';
import { AssetRetiredError } from '../errors/asset-retired.error';
import { AssetAssignment } from './asset-assignment.entity';

export class Asset extends AggregateRootBase {
  private _number: number;
  private _name: string;
  private _category: AssetCategory;
  private _serialNumber: string | null;
  private _description: string | null;
  private _status: AssetStatus;
  private _purchaseDate: Date | null;
  private _purchaseValue: number | null;
  private _assignments: AssetAssignment[];

  private constructor(props: AssetProps) {
    super(props.id, props.tenantId);
    this._number = props.number;
    this._name = props.name;
    this._category = props.category;
    this._serialNumber = props.serialNumber;
    this._description = props.description;
    this._status = props.status;
    this._purchaseDate = props.purchaseDate;
    this._purchaseValue = props.purchaseValue;
    this._assignments = props.assignments.map((a) => AssetAssignment.reconstitute(a));
  }

  static create(
    tenantId: string,
    number: number,
    name: string,
    category: AssetCategory,
    serialNumber: string | null,
    description: string | null,
    purchaseDate: Date | null,
    purchaseValue: number | null,
  ): Asset {
    return new Asset({
      id: generateId(),
      tenantId,
      number,
      name,
      category,
      serialNumber,
      description,
      status: AssetStatus.ACTIVE,
      purchaseDate,
      purchaseValue,
      assignments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: AssetProps): Asset {
    return new Asset(props);
  }

  get number(): number {
    return this._number;
  }
  get name(): string {
    return this._name;
  }
  get category(): AssetCategory {
    return this._category;
  }
  get serialNumber(): string | null {
    return this._serialNumber;
  }
  get description(): string | null {
    return this._description;
  }
  get status(): AssetStatus {
    return this._status;
  }
  get purchaseDate(): Date | null {
    return this._purchaseDate;
  }
  get purchaseValue(): number | null {
    return this._purchaseValue;
  }
  get assignments(): AssetAssignment[] {
    return this._assignments;
  }
  get activeAssignment(): AssetAssignment | undefined {
    return this._assignments.find((a) => a.isActive);
  }

  update(
    name: string,
    category: AssetCategory,
    serialNumber: string | null,
    description: string | null,
    purchaseDate: Date | null,
    purchaseValue: number | null,
  ): void {
    this._name = name;
    this._category = category;
    this._serialNumber = serialNumber;
    this._description = description;
    this._purchaseDate = purchaseDate;
    this._purchaseValue = purchaseValue;
    this.touch();
  }

  assign(projectId: string | null, employeeId: string | null): void {
    if (this._status === AssetStatus.RETIRED) {
      throw new AssetRetiredError();
    }
    if (this._status !== AssetStatus.ACTIVE) {
      throw new AssetAlreadyAssignedError();
    }
    const assignment = AssetAssignment.create(this._id, projectId, employeeId);
    this._assignments.push(assignment);
    this._status = AssetStatus.ASSIGNED;
    this.touch();
  }

  return(): void {
    if (this._status !== AssetStatus.ASSIGNED) {
      throw new AssetInvalidTransitionError(this._status, AssetStatus.ACTIVE);
    }
    const active = this.activeAssignment;
    if (active) {
      active.markReturned();
    }
    this._status = AssetStatus.ACTIVE;
    this.touch();
  }

  retire(): void {
    if (this._status === AssetStatus.RETIRED) {
      throw new AssetInvalidTransitionError(this._status, AssetStatus.RETIRED);
    }
    if (this._status === AssetStatus.ASSIGNED) {
      throw new AssetInvalidTransitionError(this._status, AssetStatus.RETIRED);
    }
    this._status = AssetStatus.RETIRED;
    this.touch();
  }
}
