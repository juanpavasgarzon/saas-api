import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { ConflictError } from '@core/domain/errors/conflict.error';
import { generateId } from '@utils/uuid.util';

import { type WarehouseProps } from '../contracts/warehouse-props.contract';

export class Warehouse extends AggregateRootBase {
  private _name: string;
  private _location: string | null;
  private _isActive: boolean;

  private constructor(props: WarehouseProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._location = props.location;
    this._isActive = props.isActive;
  }

  static create(tenantId: string, name: string, location: string | null): Warehouse {
    return new Warehouse({
      id: generateId(),
      tenantId,
      name,
      location,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: WarehouseProps): Warehouse {
    return new Warehouse(props);
  }

  get name(): string {
    return this._name;
  }

  get location(): string | null {
    return this._location;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  update(name: string, location: string | null): void {
    this._name = name;
    this._location = location;
    this.touch();
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new ConflictError('Warehouse is already inactive');
    }
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('Warehouse is already active');
    }
    this._isActive = true;
    this.touch();
  }
}
